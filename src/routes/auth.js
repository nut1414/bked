import express from 'express'
import passport from 'passport'
import process from 'process'
import jwt from 'jsonwebtoken'
import { getToken } from '../utils/auth.js'

const router = express.Router()

router.post('/signup', passport.authenticate('signup', {session:false}),
 async (req, res) => {
     res.json({
        message: 'Signup successful',
        user: req.user
      })

})

router.post('/login', (req, res, next) => {
        passport.authenticate('login', {session: false}, (err, user) =>{
                try{
                    if (err||!user){
                        return next(err)
                    }
                    req.login(user, {session:false}, async error => {
                            if (error) return next(error)
                            const body = {_id:user._id, email: user.email}
                            const token = await getToken(body)
                            return res.json({token})
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