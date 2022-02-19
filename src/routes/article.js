import express from 'express'
import multer from 'multer'
import { nanoid } from 'nanoid'
import * as mime from 'mime-types'
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
        }else throw 'User not found'
    }).catch((err)=>{
        res.status(404).send({error:err})
        console.log(err)
    })

})



router.get('/:id', async (req, res) => {
    var article = await Article.findOne({user_id:req.params.id})
    console.log(article)
    res.status(200).send(article)
})


router.post('/:id/picup', upload.single('image'), (req, res) => {
    console.log(req.file)
    Article.findOneAndUpdate({user_id:req.params.id},{}).then(article_data => {
        if(article_data){
            res.status(200).send(article_data)
            console.log(article_data)
        }else throw 'User not found'
    }).catch((err)=>{
        res.status(404).send({error:err})
        console.log(err)
    })

})

export default router