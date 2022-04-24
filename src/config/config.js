import 'dotenv/config'

export default {
    memory_db_test: true,
    mongodb_uri: process.env.MONGODB_URI,
    port: process.env.PORT || 5000,
    jwt_secret: process.env.jwt_secret,
  }