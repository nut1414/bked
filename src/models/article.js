import mongoose from 'mongoose'
import { nanoid } from 'nanoid'


const articleSchema = new mongoose.Schema({
    title: { type: String, required: true },
    article_id: {type: String, default: nanoid()},
    user_id: { type: String, required: true },
    thumb_pic: { type: String, default: 'default.jpg' },
    text: { type:String, required: true },
    views: { type: Number, default: 0 },
    shares: { type: Number, default: 0 },
}, { timestamps: true })

export default mongoose.model('Article', articleSchema)