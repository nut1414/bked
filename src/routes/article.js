import express from 'express'
import multer from 'multer'
import { nanoid } from 'nanoid'
import * as mime from 'mime-types'
import fs from 'fs'
import path from 'path'
import Article from '../models/article.js'
import User from '../models/user.js'
import { verifyUser } from '../utils/auth.js'
import { parsePageQuery, parseArticleQuery } from '../utils/validate.js'
import user from '../models/user.js'

const router = express.Router()

const storage = multer.diskStorage({
    destination: (req,file,cb) => {
        cb(null, 'uploads/')
    },
    filename: (req, file, cb) => {
        req.filename = nanoid() + '.' + mime.extension(file.mimetype)
        cb(null,req.filename)
    }
})
const upload = multer({storage})






router.get('/', parsePageQuery, parseArticleQuery, (req, res) => {
    const pageQuery = {
        ...req.query,
        user_id: req.query.user_id,
        page: undefined,
        limit: undefined
    }
    
    const pageOption = {
        page: req.query.page,
        limit: req.query.limit,
        select:{
            title: 1,
            user_id: 1,
            tags: 1,
            pic: 1,
            views: 1,
            shares: 1,
        }
    }
    try{
        Article.paginate(pageQuery,pageOption,(err,result)=>{
            
                if (err) throw err
                if (result) {
                    let searchres = {
                        page: result.page,
                        total_pages: result.totalPages,
                        limit: result.limit,
                        total: result.totalDocs,
                        result: result.docs
                    }
                    res.status(200).send(searchres)
                }else throw 'Article not found'
            

        })
    }catch(e){
        res.status(500).send({error:e})
        console.log(e)
    }
})



router.post('/create', verifyUser, async (req,res) =>{
    let user = await User.findOne({_id:req.user._id})
    try{
        if(!user) throw 'User does not exist.'
        const article = new Article({
            title: req.body.title,
            user_id: req.user._id,
            text: req.body.text})
        if(!article) throw 'Fail to create article.'
        await user.articles.push(article._id)
        await article.save()
        await user.save()

        res.send({status: 'ok' , message: 'Article created.', article_id: article._id })
    } catch(err){
        res.status(500).send({error:err})
        console.log(err)
    }
})


router.get('/id/:id', async (req, res) => {
    let article = await Article.findOne({_id:req.params.id})
    if (article) Article.updateOne({_id:req.params.id},{views:{$inc: { seq: 1} }})
    console.log(article)
    res.status(200).send(article)
})

router.delete('/id/:id', verifyUser, async (req,res) =>{
    let user = await User.findOne({_id:req.user._id})
    let article = await Article.findOne({_id:req.params.id})
    try{
        if(!user) throw 'User does not exist.'
        if(!article) throw 'Article does not exist.'
        if(article.user_id != req.user._id) throw 'User does not have permission to delete this.'
        
        await User.updateOne({ _id:req.user._id }, {
            $pullAll: {
                articles: [req.params.id],
            },
        });
        await Article.deleteOne({_id:req.params.id})

        res.send({status: 'ok' , message: 'Article deleted.', article_id: article._id })
    } catch(err){
        res.status(500).send({error:err})
        console.log(err)
    }
})


//untested
/*
router.post('/id/:id/bgpicup', verifyUser, upload.single('image'), async (req, res) => {
    let article = await Article.findOne({article_id:req.params.id})
    if(!article) res.status(500).send({error:'Unknown Article.'})
    if(req.filename && article.user_id==req.user._id){
        if (article.pic!='defaultbg.jpg')
        await fs.promises.unlink(
            path.resolve('uploads',user.profile_bg))
                .catch(e=>console.log(e))
        try{
            Article.findOneAndUpdate(
                {article_id:req.params.id},
                {thumb_pic:req.filename},
                {new:true})
                .then(update_ad=>{
                if(update_ad){
                    res.status(200).send({status:'Success!'})
                }else throw 'Article not found'
            }
            )
        }catch(err){
            res.status(500).send({error:err})
            console.log(err)
            User.updateOne({article_id:req.params.id},{pic:'defaultbg.jpg'})
        }
    }else{
        if (req.filename)
        await fs.promises.unlink(path.resolve('uploads',req.filename))
                         .catch(e=>console.log(e))
        res.status(500).send({error:'Unable to complete request.'})
    }
})
*/

export default router