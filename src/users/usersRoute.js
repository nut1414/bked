import express from 'express'
import * as controller from './usersController.js'
import { parsePageQuery, parseUserQuery } from '../utils/validate.js'
import { verifyUser } from '../auth/authUtil.js'
import uploadFile from '../utils/uploadfile.js'

const router = express.Router()

router.get('/', parsePageQuery, parseUserQuery, controller.userQuery)
router.get('/id/:id', controller.userById)
router.post('/id/:id/picup', verifyUser, uploadFile.single('image'), controller.profilePicUp)
router.post('/id/:id/bgpicup', verifyUser, uploadFile.single('image'), controller.bgPicUp)
router.post('/profile/:id', controller.generateProfile)

export default router