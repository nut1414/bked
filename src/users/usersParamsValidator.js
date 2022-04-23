import Joi from "joi"
import APIError from "../errors/APIError"

export const querySchema = Joi.object().keys({
    page: Joi.number().integer().min(1),
    limit: Joi.number().integer().min(1),
    title: Joi.string(),
    author: Joi.string()
})
  