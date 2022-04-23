import Joi from 'joi'

export const querySchema = Joi.object().keys({
    page: Joi.number().integer().min(1),
    limit: Joi.number().integer().min(1),
    title: Joi.string(),
    tags: Joi.array().string(),
    author: Joi.string()
})