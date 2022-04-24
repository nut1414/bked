const { connect, disconnect } = require('./dbHandler.js')

beforeAll(async ()=>{
    await connect()    
})

afterAll(async ()=>{
    await disconnect()
})