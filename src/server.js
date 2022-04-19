import 'dotenv/config'
import mongoose from 'mongoose'
import app from './app.js'

mongoose.connect(process.env.MONGODB_URL,e => {if (e) console.log(e)})

const port = process.env.port || 5000

app.listen(port, () => {
    console.log('Server is running at port ' + port)
})


