import express from 'express'
import * as controller from './usersController.js'
import { verifyUser } from '../auth/authUtil.js'
import uploadFile from '../utils/uploadfile.js'
import { validateUserId, validateUserQuery } from './usersAPIValidator.js'

const router = express.Router()

router.get('/', validateUserQuery, controller.userQuery)
router.get('/id/:id', validateUserId, controller.userById)
router.post('/id/:id/picup', validateUserId, verifyUser, uploadFile.single('image'), controller.profilePicUp)
router.post('/id/:id/bgpicup', validateUserId, verifyUser, uploadFile.single('image'), controller.bgPicUp)
router.post('/profile/:id', controller.generateProfile)

export default router