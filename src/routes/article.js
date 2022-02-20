import express from 'express'
import multer from 'multer'
import { nanoid } from 'nanoid'
import * as mime from 'mime-types'
import fs from 'fs'
import path from 'path'
import Article from '../models/article.js'


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
        res.status(404).send({error:err})
        console.log(err)
    })

})



router.get('/:id', async (req, res) => {
    var article = await Article.findOne({article_id:req.params.id})
    console.log(article)
    res.status(200).send(article)
})



router.post('/:id/thumbup', upload.single('image'), async (req, res) => {
    let article_data = await Article.findOne({article_id:req.params.id})
    if(req.filename && article_data){
        await fs.promises.unlink(path.resolve('uploads',article_data.thumb_pic)).catch(e=>console.log(e))
        try{
            Article.findOneAndUpdate({article_id:req.params.id},{thumb_pic:req.filename},{new:true}).then(update_ad=>{
                if(update_ad){
                    console.log(req.filename)
                    res.status(200).send(update_ad)
                    console.log(update_ad)
                }else throw 'Article not found'
            })
        }catch(err){
            res.status(404).send({error:err})
            console.log(err)
            Article.updateOne({article_id:req.params.id},{thumb_pic:'default.jpg'})
        }
    }else{
        res.status(404).send({error:'Unable to complete request.'})
    }
})


export default router