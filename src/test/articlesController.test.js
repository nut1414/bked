import { mockRequest, mockResponse } from './mockEx.js'
import User from '../users/user.js'
import Article from '../articles/article.js'
import bcrypt from 'bcrypt'
import * as articlesController from '../articles/articlesController.js'
import { resolve } from '../node_modules/uri-js/dist/es5/uri.all.js'

const userData = {
    display_name: 'test_user427',
    email: 'testemail@email.com',
    password: bcrypt.hashSync("password",10)
}

const articleData = {
    title: 'test article',
    text: 'abc'
}

beforeAll(async () => {
    const user = await User.create(userData)
    articleData.user_id = user._id
    await Article.create(articleData)
})

describe('Article Controller', () => {
    test('searching article by id', async () => {
        const article = await Article.findOne(articleData)
        const user = await User.findOne(userData)
        const req = mockRequest({id:article._id.toString()})
        const res = mockResponse()
        
        await articlesController.articleById(req, res, err=>{
                if(!err){
                    resolve()
                }
                throw err
            })
        
        expect(res.statusCode).toBe(200)
        expect(res.body._id.toString()).toBe(article._id.toString())
        expect(res.body.user_id.toString()).toBe(user._id.toString())
        expect(res.body.title).toBe(article.title)
        expect(res.body).toEqual(expect.not.objectContaining({text:article.text}))
    })
    test('searching article by query', async () => {
        const article = await Article.findOne(articleData)
        const user = await User.findOne(userData)
        const query = {
            page: 1,
            limit: 20,
        }
        
        let req = mockRequest({},query)
        const res = mockResponse()
        await articlesController.articleQuery(req, res, err=>{
                if(!err){
                    resolve()
                }
                throw err
            })

        expect(res.statusCode).toBe(200)
        expect(res.body.pg).toBe(1)
        expect(res.body.total_pg).toBe(1)
        expect(res.body.limit).toBe(20)
        expect(res.body.total).toBe(res.body.data.length)
        expect(res.body.data[0].title).toBe(article.title)
        expect(res.body.data[0].user_id.toString()).toBe(user._id.toString())
    })
    test('reading an article', async () => {
        const article = await Article.findOne(articleData)
        const user = await User.findOne(userData)
        const req = mockRequest({id:article._id.toString()})
        const res = mockResponse()
        
        await articlesController.readArticleById(req, res, err=>{
                if(!err){
                    resolve()
                }
                throw err
            })
        const article2 = await Article.findOne(articleData)
        expect(res.statusCode).toBe(200)
        expect(res.body._id.toString()).toBe(article._id.toString())
        expect(res.body.user_id.toString()).toBe(user._id.toString())
        expect(res.body.title).toBe(article.title)
        expect(res.body.text).toBe(article.text)
        expect(article2.views).toBe(article.views+1)
    })
})

