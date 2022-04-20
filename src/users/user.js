import mongoose from 'mongoose'
import { validateEmail } from '../utils/validate.js'
import bcrypt from 'bcrypt'
import mongoosePaginate from 'mongoose-paginate-v2'

const userSchema = new mongoose.Schema({
    user_id: {type: String, required: false, lowercase:true, default:'nah'},
    display_name: {type: String, required: false, default:'nah'},
    email: {type: String, required: true, unique:true, lowercase:true, validate: {validator : (x) => validateEmail(x), message: (y) => `${y} is invalid email.`}},
    password: {type: String, required: true},
    profile_pic: {type: String, default:'default.jpg'},
    profile_bg: {type: String, default:'defaultbg.jpg'},
    profile_desc: {type: String, default:''},
    articles: {type: [String], default:[]},
    followers: {type: [String], default:[]},
    following: {type: [String], default:[]},
    role: {type: String, default: 'user', enum: ['user', 'admin']},
}, { timestamps: true })

userSchema.plugin(mongoosePaginate)


export default mongoose.model('User', userSchema)