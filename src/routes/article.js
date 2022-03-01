import express from 'express'
import multer from 'multer'
import { nanoid } from 'nanoid'
import * as mime from 'mime-types'
import fs from 'fs'
import path from 'path'
import Article from '../models/article.js'
import { verifyUser } from '../utils/auth.js'

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



router.get('/', (req, res) => {
    Article.find().then(article_data =>{
        if(article_data){
            res.status(200).send(article_data)
            console.log(article_data)
        }else throw 'Article not found'
    }).catch((err)=>{
        res.status(500).send({error:err})
        console.log(err)
    })

})



router.get('/id/:id', async (req, res) => {
    var article = await Article.findOne({article_id:req.params.id})
    console.log(article)
    res.status(200).send(article)
})


//untested
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


export default router