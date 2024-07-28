import {UserModel} from '../models/user/User.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import asyncHandler from 'express-async-handler'

// @desc Login
// @route POST /auth
// @access Public
const login = asyncHandler(async (req, res) => {
    const { emailAddress, password } = req.body

    if (!emailAddress || !password) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    const user = await UserModel.findOne({ emailAddress })

    if (!user) {
        return res.status(404).json({ message: 'No User found' })
    }

    if (!user.isValidUser) {
        return res.status(401).json({ message: 'Unconfirmed', userId: user._id, username: user.username })
    }

    if (user.isBlocked) {
        return res.status(403).json({ message: 'User is blocked' })
    }

    const match = await bcrypt.compare(password, user.hashedPassword)

    if (!match) {
        return res.status(401).json({ message: 'Unauthorized', userId: user._id, username: user.username })
    }
    
    const accessToken = signAccessToken(user.emailAddress, user._id, user.role)

    const refreshToken = jwt.sign(
        { "emailAddress": user.emailAddress },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '7d' }
    )

    // Create secure cookie with refresh token 
    res.cookie('jwt', refreshToken, {
        httpOnly: true, //accessible only by web server 
        secure: true, //https
        sameSite: 'None', //cross-site cookie 
        maxAge: 7 * 24 * 60 * 60 * 1000 //cookie expiry: set to match rT
    })

    res.json({ accessToken: accessToken, userId: user._id, role: user.role })
})

// @desc Refresh
// @route GET /auth/refresh
// @access Public - because access token has expired
const refresh = (req, res) => {
    const cookies = req.cookies

    if (!cookies?.jwt) return res.status(401).json({ message: 'Unauthorized' })

    const refreshToken = cookies.jwt

    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        asyncHandler(async (err, decoded) => {
            if (err) return res.status(403).json({ message: 'Forbidden' })

            const user = await UserModel.findOne({ emailAddress: decoded.emailAddress })

            if (!user) return res.status(401).json({ message: 'Unauthorized' })

            const accessToken = signAccessToken(user.emailAddress, user._id, user.role)

            res.json({ accessToken: accessToken, userId: user._id, role: user.role })
        })
    )
}

// @desc Logout
// @route POST /auth/logout
// @access Public - just to clear cookie if exists
const logout = (req, res) => {
    const cookies = req.cookies
    if (!cookies?.jwt) return res.sendStatus(204) //No content
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true })
    res.json({ message: 'Cookie cleared' })
}

const signAccessToken = (emailAddress, userId, role) => {
    return jwt.sign(
        {
            "UserInfo": {
                "emailAddress": emailAddress,
                "userId": userId,
                "role": role
            }
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '15m' }
    )
}

export default {
    login,
    refresh,
    logout
}