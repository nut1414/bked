import express from 'express'
import * as controller from './articlesController.js'
import { parsePageQuery, parseArticleQuery } from '../utils/validate.js'
import { verifyUser } from '../auth/authUtil.js'
import uploadFile from '../utils/uploadfile.js'

const router = express.Router();

router.get('/', parsePageQuery, parseArticleQuery, controller.articleQuery)
router.post('/create', verifyUser, controller.articleCreate)
router.get('/id/:id', controller.articleById)
router.delete('/id/:id', verifyUser, controller.articleByIdDelete)

export default router
