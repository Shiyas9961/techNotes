const User = require('../models/User')
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


//@desc Login
//@route POST /auth
//@access Public
const login = asyncHandler( async (req, res) => {
    const { username, password } = req.body

    if(!username || !password){
        return res.status(400).json({ message : "All fields are required" })
    }

    const foundUser = await User.findOne( { username } ).exec()

    if(!foundUser || !foundUser.active){
        return res.status(401).json({ message : "Unauthorized" })
    }

    const matchPwd = await bcrypt.compare(password, foundUser.password)

    if(!matchPwd){
        return res.status(401).json({ message : "Unauthorized" })
    }

    const accessToken = jwt.sign(
        {
            "userInfo" : {
                "username" : foundUser.username,
                "roles" : foundUser.roles
            },
        },
        process.env.ACCESS_TOKEN,
        { expiresIn : '15m' }
    )
    
    const refreshToken = jwt.sign(
        { "username" : foundUser.username },
        process.env.REFRESH_TOKEN,
        { expiresIn : '7d' }
    )

    //Create secure cookie with refresh token
    res.cookie( 'jwt', refreshToken, {
        httpOnly : true,
        secure : true,
        sameSite : 'None',
        maxAge : 7 * 24 * 60 * 60 * 1000
    })

    res.json({ accessToken })
})

//@desc Refresh
//@route GET /auth/refresh
//@access Public - because of accesstoken expires
const refresh = asyncHandler( async (req, res) => {
    const cookies = req.cookies

    if( !cookies?.jwt ){
        return res.status(401).json({ message : "Unauthorized" })
    }

    const refreshToken = cookies.jwt

    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN,
        asyncHandler(async (err, decoded) => {
            if(err){
                return res.status(403).json({ message : "Forbidden" })
            }
            const foundUser = await User.findOne({ username : decoded.username })

            if(!foundUser){
                return res.status(401).json({ message : "Unauthorized" })
            }

            const accessToken = jwt.sign(
                {
                    "userInfo" : {
                        username : foundUser.username,
                        roles : foundUser.roles
                    }
                },
                process.env.ACCESS_TOKEN,
                { expiresIn : '15m' }
            )

            res.json({ accessToken })
        })
    )
})

const logout = asyncHandler(async (req, res) => {
    const cookies = await req.cookies

    if(!cookies?.jwt){
        return res.sendStatus(204)
    }
    res.clearCookie('jwt', {
        httpOnly : true, sameSite : 'None', secure : true
    })

    res.json({ message : "cookie cleared" })
})

module.exports = {
    login,
    refresh,
    logout
}