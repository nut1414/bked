import express from 'express'
import * as controller from './articlesController.js'
import { verifyUser } from '../auth/authUtil.js'
import { validateArticleId, validateArticleQuery } from './articlesAPIValidator.js'

const router = express.Router();

router.get('/', validateArticleQuery, controller.articleQuery)
router.post('/create', verifyUser, controller.articleCreate)
router.get('/id/:id', validateArticleId, controller.articleById)
router.delete('/id/:id', validateArticleId, verifyUser, controller.articleByIdDelete)

export default router
