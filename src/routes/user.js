import express from 'express'
import multer from 'multer'
import { nanoid } from 'nanoid'
import * as mime from 'mime-types'
import User from '../models/user.js'

const router = express.Router()
const storage = multer.diskStorage({
    destination: (req,file,cb) => {
        cb(null, './uploads')
    },
    filename: (req, file, cb) => {
        let filename = req.params.id + '-' + nanoid() + '.' + mime.extension(file.mimetype)
        cb(null,filename)
    }
})
const upload = multer({storage})


router.get('/', (req, res) => {
    User.find().then(user_data => {
        if(user_data){
            res.status(200).send(user_data)
            console.log(user_data)
        }else throw 'User not found'
    }).catch((err)=>{
        res.status(200).send({status:404,err})
        console.log(err)
    })

})


router.get('/:id', (req, res) => {
    User.findOne({user_id:req.params.id}).then(user_data => {
        if(user_data){
            res.status(200).send(user_data)
            console.log(user_data)
        }else throw 'User not found'
    }).catch((err)=>{
        res.status(200).send({status:404,err})
        console.log(err)
    })

})

router.post('/:id/picup', upload.single('image'), (req, res) => {
    console.log(req.file)
    User.findOne({user_id:req.params.id}).then(user_data => {
        if(user_data){
            res.status(200).send(user_data)
            console.log(user_data)
        }else throw 'User not found'
    }).catch((err)=>{
        res.status(200).send({status:404,err})
        console.log(err)
    })

})


export default router