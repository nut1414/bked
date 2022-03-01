import express from 'express'
import bodyParser from 'body-parser'
import User from '../models/user.js'
import Article from '../models/article.js'

const router = express.Router()

router.use(bodyParser.urlencoded({ extended: true }))
router.use(bodyParser.json())

router.post('/create_user',(req,res) =>{
    User.findOne({user_id:req.body.user_id})
        .then(user_data =>{
            if (user_data) throw 'User already existed!'
            const user = new User({
                user_id: req.body.user_id,
                user_name: req.body.user_name,
                email: req.body.email,
                password: req.body.password,
                })
            user.save().then(()=>{
                console.log('User was registered successfully!')
                res.send({status: 'ok' ,message: 'User was registered successfully!' })
            })
        }).catch((err)=>{
            console.log('Failed to create new user: ' + err)
            res.status(500).send({status: 'error' ,message: err })
        })
})

router.post('/create_article',(req,res) =>{
    User.findOne({user_id:req.body.user_id})
        .then(user_data =>{
            if (!user_data) throw 'No such user existed.'
            console.log(user_data)
            const article = new Article({
                title: req.body.title,
                user_id: req.body.user_id,
                text: req.body.text})
            user_data.articles.push(article._id)
            user_data.save()
            article.save().then(()=>{
                console.log('Article saved.')
                res.send({status: 'ok' ,message: 'Article saved.' })
            })
        }).catch((err)=>{
            console.log('Failed to create new article: ' + err)
            res.status(500).send({status: 'error' ,message: err })
        })
})


export default router