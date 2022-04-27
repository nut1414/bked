import Joi from 'joi'
import APIError from '../errors/APIError.js'

export const validateUserQuery = (req, res, next) => {
    //all are optional
    try{
        const schema = Joi.object().keys({
            page: Joi.number().integer().min(1),
            limit: Joi.number().integer().min(1),
            display_name: Joi.string(),
            _id: Joi.string().regex(/^[0-9a-fA-F]{24}$/)
        })
        const { error } = schema.validate(req.body)
        if (error){
            throw new APIError(error.details[0].message, 400)
        }else{
            next()
        }
    }catch(err){
        next(err)
    }
    
}

export const validateUserId = (req, res, next) => {
    try{
        const schema = Joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
        const { error } = schema.validate(req.params.id)
        if (error){
            throw new APIError(error.details[0].message, 400)
        }else{
            next()
        }
    }catch(err){
        next(err)
    }
}