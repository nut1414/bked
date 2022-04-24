import request from "supertest"
import app from '../app.js'
import User from '../users/user.js'

const regisData = {
    email: 'test@email.com',
    password: 'Password123'
}

describe('Auth API', () => {
    
    test('POST /auth/signup', async () => {
        const response = await request(app).post("/auth/signup").send(regisData)
        
        expect(response.statusCode).toBe(200)
        expect(response.body)
    })

    test('POST /auth/signin', async () => {
        const response = await request(app).post("/auth/login").send(regisData)
        const user = await User.findOne({email:regisData.email})
        
        if (user){
            expect(response.statusCode).toBe(200)
        }else{
            expect(response.statusCode).toBe(400)
            expect(response.body.error).toBe('Invalid User or Password')
        }
        
    })
    
})