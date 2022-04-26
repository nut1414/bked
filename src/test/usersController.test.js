import { mockRequest, mockResponse } from './mockEx.js'
import User from '../users/user.js'
import bcrypt from 'bcrypt'
import * as userController from '../users/usersController.js'
import { resolve } from '../node_modules/uri-js/dist/es5/uri.all.js'



const userData = {
    display_name: 'test_user427',
    email: 'testemail@email.com',
    password: bcrypt.hashSync("password",10)
}

const userData2 = {
    display_name: 'tester123',
    email: 'testery@email.com',
    password: bcrypt.hashSync("securepassword",10)
}

beforeAll(async () => {
    await User.create(userData)
    await User.create(userData2)
})

describe('User Controller', () => {
    test('searching user by id', async () => {
        const user = await User.findOne(userData)
        const req = mockRequest({id:user._id.toString()})
        const res = mockResponse()
        
        await userController.userById(req, res, err=>{
                if(!err){
                    resolve()
                }
                throw err
            })
        
        expect(res.statusCode).toBe(200)
        expect(res.body._id.toString()).toBe(user._id.toString())
        expect(res.body.display_name).toBe(user.display_name)
        expect(res.body.email).toBe(user.email)
    })

    test('searching user by query', async () => {
        const user = await User.findOne(userData)
        const user2 = await User.findOne(userData2)
        const query = {
            page: 1,
            limit: 20,
        }
        
        let req = mockRequest({},query)
        const res = mockResponse()
        await userController.userQuery(req, res, err=>{
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
        expect(res.body.data[0].display_name).toBe(user.display_name)
        expect(res.body.data[1].display_name).toBe(user2.display_name)
    })

    test('generating user profile', async () => {
        const user = await User.findOne(userData)
        const req = mockRequest({id:user._id.toString()})
        const res = mockResponse()
        
        await userController.generateProfile(req, res, err=>{
                if(!err){
                    resolve()
                }
                throw err
            })
        
        expect(res.statusCode).toBe(200)
        expect(res.body.result.display_name).toBe(user.display_name)
        expect(res.body.result).toEqual(expect.not.objectContaining({email:user.email}))
    })
})

