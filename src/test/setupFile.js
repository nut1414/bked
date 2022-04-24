import { connect, disconnect } from './dbHandler.js'

beforeAll(async ()=>{
    await connect()    
})

afterAll(async ()=>{
    await disconnect()
})