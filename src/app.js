import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import path from 'path'
import userRoute from './routes/user.js'
import articleRoute from './routes/article.js'
import adminRoute from './routes/admin.js'
import authRoute from './routes/auth.js'
import bodyParser from 'body-parser'
import './configs/passport.js'

const __dirname = path.resolve()

const app = express()

app.use(express.json())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors())
app.use('/users',userRoute)
app.use('/articles',articleRoute)
app.use('/auth',authRoute)
app.use('/uploads',express.static(path.join(__dirname,'uploads')))

app.get('/',(req,res) =>{
    res.status(200).send('Service is online.')
})

export default app