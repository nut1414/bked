import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import path from 'path'
import { usersRoute } from './users/index.js'
import { articlesRoute } from './articles/index.js'
import { authRoute } from './auth/index.js'
import bodyParser from 'body-parser'
import './configs/passport.js'

const __dirname = path.resolve()

const app = express()

app.use(express.json())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors())
app.use('/users', usersRoute)
app.use('/articles', articlesRoute)
app.use('/auth', authRoute)
app.use('/uploads', express.static(path.join(__dirname,'uploads')))

app.get('/',(req,res) =>{
    res.status(200).send('Service is online.')
})

export default app