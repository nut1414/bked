import express from 'express'
import multer from 'multer'
import { nanoid } from 'nanoid'
import * as mime from 'mime-types'
import fs from 'fs'
import path from 'path'
import User from '../models/user.js'

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
    User.find().then(user_data => {
        if(user_data){
            res.status(200).send(user_data)
            console.log(user_data)
        }else throw 'User not found'
    }).catch((err)=>{
        res.status(404).send({error:err})
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
        res.status(404).send({error:err})
        console.log(err)
    })

})

router.post('/:id/picup', upload.single('image'), async (req, res) => {
    let user_data = await User.findOne({user_id:req.params.id})
    if(req.filename && user_data){
        await fs.promises.unlink(path.resolve('uploads',user_data.profile_pic)).catch(e=>console.log(e))
        try{
            User.findOneAndUpdate({user_id:req.params.id},{profile_pic:req.filename},{new:true}).then(update_ud=>{
                if(update_ud){
                    console.log(req.filename)
                    res.status(200).send(update_ud)
                    console.log(update_ud)
                }else throw 'User not found'
            })
        }catch(err){
            res.status(404).send({error:err})
            console.log(err)
            User.updateOne({user_id:req.params.id},{profile_pic:'default.jpg'})
        }
    }else{
        res.status(404).send({error:'Unable to complete request.'})
    }
})



router.post('/:id/bgpicup', upload.single('image'), async (req, res) => {
    let user_data = await User.findOne({user_id:req.params.id})
    if(req.filename && user_data){
        await fs.promises.unlink(path.resolve('uploads',user_data.profile_bg)).catch(e=>console.log(e))
        try{
            User.findOneAndUpdate({user_id:req.params.id},{profile_bg:req.filename},{new:true}).then(update_ud=>{
                if(update_ud){
                    console.log(req.filename)
                    res.status(200).send(update_ud)
                    console.log(update_ud)
                }else throw 'User not found'
            })
        }catch(err){
            res.status(404).send({error:err})
            console.log(err)
            User.updateOne({user_id:req.params.id},{profile_bg:'default.jpg'})
        }
    }else{
        res.status(404).send({error:'Unable to complete request.'})
    }
})


export default router