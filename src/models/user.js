import mongoose from 'mongoose'
import { validateEmail } from '../utils/validate.js'


const userSchema = new mongoose.Schema({
    user_id: {type: String, required: true, lowercase:true},
    user_name: {type: String, required: true},
    email: {type: String, required: true, lowercase:true, validate: {validator : (x) => validateEmail(x), message: (y) => `${y} is invalid email.`}},
    hashed_password: {type: String, required: true},
    salt: {type: String},
    profile_pic: {type: String, default:'default'},
    profile_bg: {type: String, default:'default'},
    profile_desc: {type: String, default:''},
    articles: {type: [String], default:[]},
    followers: {type: [String], default:[]},
    following: {type: [String], default:[]},
}, { timestamps: true })

export default mongoose.model('User', userSchema)