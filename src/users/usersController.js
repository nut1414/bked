import express from 'express'
import fs from 'fs'
import path from 'path'
import User from './user.js'
import APIError from '../errors/APIError.js'
import mongoose from 'mongoose'

const router = express.Router()

export const userQuery = async (req, res, next) => {
    try{
        const pageQuery = {
            ...req.query,
            page: undefined,
            limit: undefined
        }

        const pageOption = {
            page: req.query.page || 1,
            limit: req.query.limit || 20,
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
        }else throw new APIError(404, 'User not found')
    }catch(err){
        next(err)
    }
}


export const userById = async (req, res, next) => {
    try{
        const user_data = await User.findById(req.params.id)
        if(user_data){
            res.status(200).send(user_data)
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
    }
}

// https://mongoplayground.net/p/yrPUYMTbcoc

export const generateProfile = async (req, res, next) => {
    try{
        const profile = await User.aggregate([
            {
                $lookup:
                {
                    from:'Article',
                    localField: '_id',
                    foreignField: 'user_id',
                    as: 'articles_all'
                }
            },
            {
                $project:
                {
                    "display_name": true,
                    "profile_desc": true,
                    "profile_pic": true,
                    "profile_bg": true,
                    "articles_all": true,
                    "followers": true,
                    "following": true
                }
            },
            {
                $match:
                {
                    "_id": mongoose.Types.ObjectId(req.params.id)
                }
            }
        ])
    if (profile.length != 0)
    res.status(200).send({result:profile[0]})
    }catch(err){
        next(err)
    }
}

export default router