import mongoose from 'mongoose'

export const connect = async () => {
    const uri = process.env.MONGO_URI
    await mongoose.connect(uri)
}

export const disconnect = async () => {
    await mongoose.connection.dropDatabase()
    await mongoose.connection.close()
}
