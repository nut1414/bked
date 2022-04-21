import mongoose from 'mongoose'
import { nanoid } from 'nanoid'
import mongoosePaginate from 'mongoose-paginate-v2'

const articleSchema = new mongoose.Schema({
    title: { type: String, required: true },
    user_id: { type: mongoose.ObjectId, required: true },
    tags: {type: [String], default: [] },
    pic: { type: String, default: 'defaultbg.jpg' },
    text: { type: String, required: true },
    views: { type: Number, default: 0 },
    shares: { type: Number, default: 0 },
}, { timestamps: true })

articleSchema.plugin(mongoosePaginate)

export default mongoose.model('Article', articleSchema)