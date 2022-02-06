import dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import userRoute from './routes/user.js'
import articleRoute from './routes/article.js'

const app = express()

mongoose.connect(process.env.MONGODB_URL,e => {if (e) console.log(e)})

app.use(cors())
app.use('/u',userRoute)
app.use('/a',articleRoute)

app.get('/',(req,res) =>{
    res.status(200).send('Service is online.')
})

app.listen(5000,()=>{
    console.log('Server is running')
})


