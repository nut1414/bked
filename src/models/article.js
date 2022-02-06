import mongoose from 'mongoose'
import { randomUUID } from 'crypto'


const articleSchema = new mongoose.Schema({
    title: { type: String, required: true },
    article_uuid: {type: String, default: randomUUID()},
    user_id: { type: String, required: true },
    thumb_pic: { type: String, default: 'default' },
    text: { type:String, required: true },
    views: { type: Number, default: 0 },
    shares: { type: Number, default: 0 },
    created_at: {type: Date, default: () => Date.now(), immutable:true}
})

export default mongoose.model('Article', articleSchema)