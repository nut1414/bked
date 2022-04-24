import 'dotenv/config'
import passport from 'passport'
import passportLocal from 'passport-local'
import passportJwt from 'passport-jwt'
import bcrypt from 'bcrypt'
import User from '../users/user.js'
import APIError from '../errors/APIError.js'

const JwtStrategy = passportJwt.Strategy,
    ExtractJwt = passportJwt.ExtractJwt,
    LocalStrategy = passportLocal.Strategy

const opts = {}


passport.use('signup', new LocalStrategy(
        {
            usernameField: 'email',
            passwordField: 'password'
        },
        async (email, password, done) => {
            try{
                if (await User.findOne({email})) throw new APIError('User already existed',409)
                if (!email || !password) throw new APIError('Bad Request',400)
                const hash = await bcrypt.hash(password,10);
                const user = await User.create({email, password:hash})
                return done(null, user)
            }catch(err){
                done(err,null)
            }
        }
    )
)

passport.use('login', new LocalStrategy(
        {
            usernameField: 'email',
            passwordField: 'password'        
        },
        async (email, password, done) => {
            try{
                const user = await User.findOne({email})
                if(!user){
                    throw new APIError('Invalid User or Password',400)
                }
                const isvalid = await bcrypt.compare(password,user.password)
                if(!isvalid){
                    throw new APIError('Invalid User or Password',400)
                }
                return done(null, user, {message:'Logged in Successfully'})
            }catch(err){
                return done(err,null)
            }
        }
    )
)

opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()
opts.secretOrKey = process.env.JWT_SECRET

passport.use('jwt', new JwtStrategy(opts, (token, done) => {
        console.log(token)
        User.findOne({ _id: token._id }, (err, user) => {
            console.log(user)
            if (err) {
                return done(err, false)
            }
            if (user) {
                return done(null, user)
            } else {
                return done(null, false)
            }

        })
    })
)
