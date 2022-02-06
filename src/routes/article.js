import express from 'express'
import Article from '../models/article.js'

const router = express.Router()
router.get('/', (req, res) => {
    Article.find().then(article_data =>{
        if(article_data){
            res.status(200).send(article_data)
            console.log(article_data)
        }else throw 'User not found'
    }).catch((err)=>{
        res.status(200).send({status:404,err})
        console.log(err)
    })

})



router.get('/:id', async (req, res) => {
    var article = await Article.findOne({user_id:req.params.id})
    console.log(article)
    res.status(200).send(article)
})


export default router