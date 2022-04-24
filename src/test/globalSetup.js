import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'
import config from '../config/config.js'

export default async () => {
    if(config.memory_db_test){
        const mongod = await MongoMemoryServer.create()
        const uri = mongod.getUri()
        global.__MONGOINSTANCE = mongod
        process.env.MONGO_URI = uri.slice(0, uri.lastIndexOf('/'));
        await mongoose.connect(uri);
        await mongoose.connection.db.dropDatabase();
        await mongoose.disconnect();
    }

}