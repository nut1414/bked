import express from 'express'
import fs from 'fs'
import path from 'path'
import User from './user.js'
import APIError from '../errors/APIError.js'

const router = express.Router()

export const userQuery = async (req, res, next) => {
    try{
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
                display_name: 1,
                profile_pic: 1,
                profile_bg: 1,
                profile_desc: 1,
                _id: 1
            }
        }

        const result = await User.paginate(pageQuery,pageOption)
        if (result) {
            const searchres = {
                pg: result.page,
                total_pg: result.totalPages,
                limit: result.limit,
                total: result.totalDocs,
                data: result.docs
            }
            res.status(200).send(searchres)
        }else throw new APIError(404, 'Article not found')
    }catch(err){
        next(err)

    }
}


export const userById = async (req, res, next) => {
    try{
        const user_data = await User.findById(req.params.id)
        if(user_data){
            res.status(200).send(user_data)
            console.log(user_data)
        }else throw new APIError(500, 'User not found')
    }catch(err){
        next(err)

    }
}

export const profilePicUp = async (req, res, next) => {
    try{
        let user_data = await User.findById(req.params.id)
        if(req.filename && user_data._id.equals(req.user._id)){
            if (user_data.profile_pic!='default.jpg'){
                await fs.promises.unlink(
                            path.resolve('uploads',user_data.profile_pic))
                            .catch(e=>{console.log(e)})
            }
            user_data = await User.findByIdAndUpdate(req.params.id,{profile_pic:req.filename},{new:true})
            if (user_data){
                console.log(req.filename)
                res.status(200).send({status:'Success!'})
            }else throw new APIError(500, 'Unable to complete request')
        }else{
            await fs.promises.unlink(path.resolve('uploads',req.filename))
                                .catch(e=>console.log(e))
            throw new APIError(500, 'Unable to complete request')
        }
    }catch(err){
        next(err)
        //res.status(500).send({ error:err })
        //console.log(err)
    }
}

export const bgPicUp = async (req, res, next) => {
    try{
        let user_data = await User.findById(req.params.id)
        if(req.filename && user_data._id.equals(req.user._id)){
            if (user_data.profile_bg!='defaultbg.jpg'){
                await fs.promises.unlink(
                            path.resolve('uploads',user_data.profile_bg))
                            .catch(e=>{console.log(e)})
            }
            user_data = await User.findByIdAndUpdate(req.params.id,{profile_bg:req.filename},{new:true})
            if (user_data){
                console.log(req.filename)
                res.status(200).send({status:'Success!'})
            }else throw new APIError(500, 'Unable to complete request')
        }else{
            await fs.promises.unlink(path.resolve('uploads',req.filename))
                                .catch(e=>console.log(e))
            throw new APIError(500, 'Unable to complete request')
        }
    }catch(err){
        next(err)
        //res.status(500).send({ error:err })
        //console.log(err)
    }
}

// to be continue
export const generateProfile = async (req, res, next) => {
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