import config from '../config/config.js'

export default async () => {
    if(config.memory_db_test){
        const instance = global.__MONGOINSTANCE
        await instance.stop()
    }
}