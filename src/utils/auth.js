import passport from 'passport'
import jwt from 'jsonwebtoken'

export const getToken = user => {
    return jwt.sign(user, process.env.JWT_SECRET, {
        expiresIn: eval(process.env.SESSION_EXPIRE),
    })
}

export const getRefreshToken = user => {
    const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, 
        {expiresIn: eval(process.env.REFRESH_TOKEN_EXPIRE)})
    return refreshToken
}


export const verifyUser = passport.authenticate('jwt', { session: false })