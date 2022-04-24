import config from './config/config.js'
import mongoose from 'mongoose'
import app from './app.js'

mongoose.connect(config.mongodb_uri,e => {if (e) console.log(e)})

const port = config.port

app.listen(port, () => {
    console.log('Server is running at port ' + port)
})


