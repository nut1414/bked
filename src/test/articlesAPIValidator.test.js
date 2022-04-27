import { validateArticleQuery, validateArticleId } from '../articles/articlesAPIValidator.js'
import APIError from '../errors/APIError.js'
import {mockRequest, mockResponse} from './mockEx.js' 

describe('Article API Request Validator', () => {
    test('query validator 1/2',() => {
        const req = mockRequest({}, {page: -1})
        const res = mockResponse()
        expect(() => validateArticleQuery(req, res, err=>{
            if(!err){
                resolve()
            }
            throw err 
        })).toThrow(APIError)
    })
    test('query validator 2/2',() => {
        const req = mockRequest({}, {})
        const res = mockResponse()
        expect(() => validateArticleQuery(req, res, err=>{
            if(!err){
                resolve()
            }
            throw err
        })).not.toThrow(APIError)
    })

    test('id validator',() => {
        const req = mockRequest({id:123})
        const res = mockResponse()
        expect(() => validateArticleId(req, res, err=>{
            if(!err){
                resolve()
            }
            throw err
        })).toThrow(APIError)
    })
})