import express from 'express'
import fs from 'fs'
import path from 'path'
import User from './user.js'

const router = express.Router()

export const userQuery = (req, res) =>  {
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
            profile_pic: 1,
            profile_bg: 1,
            profile_desc: 1,
        }
    }

    try{
        User.paginate(pageQuery,pageOption,(err,result)=>{
                if (err) throw err
                if (result) {
                    const searchres = {
                        page: result.page,
                        total_pages: result.totalPages,
                        limit: result.limit,
                        total: result.totalDocs,
                        result: result.docs
                    }
                    res.status(200).send(searchres)
                    console.log(searchres)
                }else throw new Error('Article not found')
        })
    }catch(e){
        res.status(500).send({error:e})
        console.log(e)
    }
}

export const userById = (req, res) => {
    User.findOne({user_id:req.params.id}).then(user_data => {
        if(user_data){
            res.status(200).send(user_data)
            console.log(user_data)
        }else throw new Error('User not found')
    }).catch((err)=>{
        res.status(500).send({error:err})
        console.log(err)
    })

}

export const profilePicUp = async (req, res) => {
    let user = await User.findOne({user_id:req.params.id})
    if(!user) res.status(500).send({error:'Unknown User.'})
    if(req.filename && user._id.equals(req.user._id)){
        if (user.profile_pic!='default.jpg')
        await fs.promises.unlink(
            path.resolve('uploads',user.profile_pic))
                .catch(e=>console.log(e))
        try{
            User.findOneAndUpdate(
                {user_id:req.params.id},
                {profile_pic:req.filename},
                {new:true})
                .then(update_ud=>{
                    if(update_ud){
                        console.log(req.filename)
                        res.status(200).send({status:'Success!'})
                    }else throw new Error('Unable to complete request.')
                }
            )
        }catch(err){
            res.status(500).send({error:err})
            console.log(err)
            User.updateOne({user_id:req.params.id},{profile_pic:'default.jpg'})
        }
    }else{
        await fs.promises.unlink(path.resolve('uploads',req.filename))
                         .catch(e=>console.log(e))
        res.status(500).send({error:'Unable to complete request.'})
    }
}

export const bgPicUp = async (req, res) => {
    let user = await User.findOne({user_id:req.params.id})
    if(!user) res.status(500).send({error:'Unknown User.'})
    if(req.filename && user._id.equals(req.user._id)){
        if (user.profile_bg!='defaultbg.jpg')
        await fs.promises.unlink(
            path.resolve('uploads',user.profile_bg))
                .catch(e=>console.log(e))
        try{
            User.findOneAndUpdate(
                {user_id:req.params.id},
                {profile_bg:req.filename},
                {new:true})
                .then(update_ud=>{
                    if(update_ud){
                        console.log(req.filename)
                        res.status(200).send({status:'Success!'})
                    }else throw new Error('Unable to complete request.')
                }
            )
        }catch(err){
            res.status(500).send({error:err})
            console.log(err)
            User.updateOne({user_id:req.params.id},{profile_bg:'defaultbg.jpg'})
        }
    }else{
        if (req.filename)
        await fs.promises.unlink(path.resolve('uploads',req.filename))
                         .catch(e=>console.log(e))
        res.status(500).send({error:'Unable to complete request.'})
    }
}

// to be continue
export const generateProfile = async (req, res) => {
    const user = await User.findOne({user_id:req.params.id})
    const profile = await User.aggregate({
        $lookup:
          {
           
          }
     })
    if(!user) res.status(500).send({error:'Unknown User.'})
    try{

    }catch(err){
        res.status(500).send({error:err})
        console.log(err)
    }
}

export default router