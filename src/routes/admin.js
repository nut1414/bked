import express from 'express'
import User from '../models/user.js'
import Article from '../models/article.js'

const router = express.Router()


router.get('/create_user',(req,res) =>{
    const user = new User({
        username: req.body.username,
        email: req.body.email,
        hashed_password: req.body.password, salt:'salt'})
    user.save((err) => {
        if (err) {
            res.status(500).send({status: 'error' ,message: err })
            return
        }
        res.send({status: 'ok' ,message: 'User was registered successfully!' })
    })

})

router.get('/create_article',(req,res) =>{
    const article = new Article({
        title: req.body.title,
        user_id: req.body.user_id,
        text: req.body.text})
    article.save((err) => {
        if (err) {
            res.status(500).send({status: 'error' ,message: err })
            return
        }
        res.send({status: 'ok' ,message: 'New article was created successfully' })
    })

})


export default router