import express from 'express'
import passport from 'passport'
import APIError from '../errors/APIError.js'
import { getToken } from './authUtil.js'
import './passport.js'


const router = express.Router()


router.post('/signup', passport.authenticate('signup', {session:false}),
 async (req, res, next) => {
     if (req.user){
        res.status(200).json({
            message: 'Signup successful',
            user: req.user
          })
     }else{
        next(req.err)
     }
})

router.post('/login', (req, res, next) => {
        passport.authenticate('login', {session: false}, (err, user) =>{
                try{
                    if (err||!user){
                        throw new APIError('Invalid User or Password', 400)
                    }
                    req.login(user, {session:false}, async error => {
                            if (error) throw new APIError('Invalid User or Password', 400)
                            const body = {_id:user._id, email: user.email}
                            const token = await getToken(body)
                            return res.status(200).json({message:'Successfully login.',token})
                        }
                    )
                }catch(e){
                    return next(e)
                }
            }
        )(req, res, next)
    }
)


export default router