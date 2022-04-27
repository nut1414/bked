import Joi from 'joi'
import APIError from '../errors/APIError.js'

export const validateArticleQuery = (req, res, next) => {
    //all are optional
    try{
        const schema = Joi.object().keys({
            page: Joi.number().integer().min(1),
            limit: Joi.number().integer().min(1),
            title: Joi.string(),
            tags: Joi.array().items(Joi.string()),
            user_id: Joi.string().regex(/^[0-9a-fA-F]{24}$/)
        })
        const { error } = schema.validate(req.query)
        if (error){
            throw new APIError("Bad Request", 400)
        }else{
            next()
        }
    }catch(err){
        next(err)
    }
    
}

export const validateArticleId = (req, res, next) => {
    try{
        const schema = Joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
        const { error } = schema.validate(req.params.id)
        if (error){
            throw new APIError("Bad Request", 400)
        }else{
            next()
        }
    }catch(err){
        next(err)
    }
}


