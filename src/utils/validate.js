import { query } from 'express'
import User from '../models/user.js'

export const validateEmail = (email) => {
    const re = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/
    return re.test(email)
}

export const validateUsername = (username) => {
    const re = /^[A-Za-z][A-Za-z0-9_]$/
    return re.test(username)
}

export const parsePageQuery = (req,res,next) => {
    let page = parseInt(req.query.page)
    let limit = parseInt(req.query.limit)
    try{
        if ( query ){
            page = (page) ? page : 1
            limit = (limit) ? limit  : 50
            req.query.page = page
            req.query.limit = limit
            return next()
        }else throw Error('Invalid search query')
    } catch(e){
        return res.status(500).json({error:e});
    }
}

export const parseArticleQuery = async (req,res,next) => {
    let query = req.query
    let page = query.page
    let limit = query.limit
    let title = query.title
    let tags = query.tags
    let author = query.author
    try{
        
        if (query){
            page = (page) ? page : 1
            limit = (limit) ? limit  : 50
            if (author){
                try{
                    var user = await User.findOne({user_id:req.query.author}) 
                    var user_id = user._id
                } catch(e){
                }
                console.log(user_id)
            }
            if (title){
                var title_query = {$regex: title,$options: 'gi'}
            }
            //tags to be implemented.
            req.query = {
                page,
                limit,
                title:title_query,
                user_id
            }
            Object.keys(req.query).forEach(key => {
                if (req.query[key] === undefined) {
                  delete req.query[key];
                }
              })

            return next()
        }else throw Error('Invalid search query')
    } catch(e){
        return res.status(500).json({error:e});
    }

}
export const parseUserQuery = async (req,res,next) => {
    let query = req.query
    let page = query.page
    let limit = query.limit
    let title = query.title
    var user = query.user
    try{
        
        if (query){
            page = (page) ? page : 1
            limit = (limit) ? limit  : 50
            if (user){
                try{
                    var user = await User.findOne({user_id:req.query.user}) 
                    var user_id = user._id
                } catch(e){
                }
                console.log(user_id)
            }
            req.query = {
                page,
                limit,
                user_id
            }
            Object.keys(req.query).forEach(key => {
                if (req.query[key] === undefined) {
                  delete req.query[key];
                }
              })

            return next()
        }else throw Error('Invalid search query')
    } catch(e){
        return res.status(500).json({error:e});
    }

}