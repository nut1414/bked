import multer from 'multer'
import { nanoid } from 'nanoid'
import * as mime from 'mime-types'

const storage = multer.diskStorage({
    destination: (req,file,cb) => {
        cb(null, 'uploads/')
    },
    filename: (req, file, cb) => {
        req.filename = nanoid() + '.' + mime.extension(file.mimetype)
        cb(null,req.filename)
    }
})
const upload = multer({storage})

export default upload