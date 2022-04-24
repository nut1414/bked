const mongoose = require('mongoose')

module.exports.connect = async () => {
    const uri = process.env.MONGO_URI
    await mongoose.connect(uri)
}

module.exports.disconnect = async () => {
    await mongoose.connection.dropDatabase()
    await mongoose.connection.close()
}
