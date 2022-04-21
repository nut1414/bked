import express from 'express'
import Article from './article.js'
import { User } from '../users/index.js'
import APIError from '../errors/APIError.js'

const router = express.Router()

export const articleQuery = async (req, res, next) => {
    try{
        const pageQuery = {
            ...req.query,
            user_id: req.query.user_id,
            page: undefined,
            limit: undefined
        }
        
        const pageOption = {
            page: req.query.page,
            limit: req.query.limit,
            select:{
                title: 1,
                user_id: 1,
                tags: 1,
                pic: 1,
                views: 1,
                shares: 1,
                _id: 1
            }
        }

        result = await Article.paginate(pageQuery,pageOption)
        if (result) {
            const searchres = {
                pg: result.page,
                total_pg: result.totalPages,
                limit: result.limit,
                total: result.totalDocs,
                data: result.docs
            }
            res.status(200).send(searchres)
        }else throw new APIError(404, 'Article not found')

    }catch(err){
        next(err)
        //res.status(500).send({error:e})
        //console.log(err)
    }
}

export const articleCreate = async (req,res, next) =>{
    try{
        let user_data = await User.findOne({_id:req.user._id})
        if(!user_data) throw new APIError(404, 'User does not exist')
        const new_article = new Article({
            title: req.body.title,
            user_id: user_data._id,
            text: req.body.text})
        if(!new_article) throw new APIError(500, 'Fail to create article')
        await user_data.articles.push(new_article._id)
        await new_article.save()
        await user_data.save()
        res.send({status: 'ok' , message: 'Article created.', article_id: new_article._id })
    } catch(err){
        next(err)
        //res.status(500).send({error:err})
        //console.log(err)
    }
}



export const articleById = async (req, res, next) => {
    try{
        const article_data = await Article.findById(req.params.id,{ title:1, user_id:1, tags: 1, pic: 1, views: 1, shares: 1 })
        if(article_data){
            res.status(200).send(article_data)
            console.log(article_data)
        }else throw new APIError(404, 'Article not found')
    }catch(err){
        next(err)
        //res.status(500).send({ error:err })
        //console.log(err)
    }
}

export const readArticleById = async (req, res, next) => {
    try{
        const article_data = await Article.findById(req.params.id,{ title:1, text:1, user_id:1, tags: 1, pic: 1, views: 1, shares: 1 })
        if(article_data){
            Article.findByIdAndUpdate(req.params.id,{views: {$inc: { seq: 1 } } })
            res.status(200).send(article_data)
            console.log(article_data)
        }else throw new APIError(404, 'Article not found')
    }catch(err){
        next(err)
        //res.status(500).send({ error:err })
        //console.log(err)
    }
}


export const articleByIdDelete = async (req, res, next) =>{
    try{
        let user_data = await User.findOne({_id:req.user._id})
        let article_data = await Article.findOne({_id:req.params.id})
        if(!user_data) throw new APIError(404, 'User does not exist')
        if(!article_data) throw new APIError(404, 'Article does not exist')
        if(article_data.user_id != req.user._id) throw new APIError(401, 'Unauthorized')
        await User.updateOne({ _id:req.user._id }, {
            $pullAll: {
                articles: [req.params.id],
            },
        })
        await Article.deleteOne({_id:req.params.id})
        res.send({status: 'ok' , message: 'Article deleted.', article_id: article_data._id })

    } catch(err){
        next(err)
    }
}



//untested
/*
router.post('/id/:id/bgpicup', verifyUser, upload.single('image'), async (req, res) => {
    let article = await Article.findOne({article_id:req.params.id})
    if(!article) res.status(500).send({error:'Unknown Article.'})
    if(req.filename && article.user_id==req.user._id){
        if (article.pic!='defaultbg.jpg')
        await fs.promises.unlink(
            path.resolve('uploads',user.profile_bg))
                .catch(e=>console.log(e))
        try{
            Article.findOneAndUpdate(
                {article_id:req.params.id},
                {thumb_pic:req.filename},
                {new:true})
                .then(update_ad=>{
                if(update_ad){
                    res.status(200).send({status:'Success!'})
                }else throw 'Article not found'
            }
            )
        }catch(err){
            res.status(500).send({error:err})
            console.log(err)
            User.updateOne({article_id:req.params.id},{pic:'defaultbg.jpg'})
        }
    }else{
        if (req.filename)
        await fs.promises.unlink(path.resolve('uploads',req.filename))
                         .catch(e=>console.log(e))
        res.status(500).send({error:'Unable to complete request.'})
    }
})
*/

export default router