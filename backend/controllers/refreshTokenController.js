
const User = require('../models/User')
const jwt = require('jsonwebtoken')

const handleRefresh = async (req, res) => {
    const cookies = req.cookies
    if (!cookies?.refreshToken) return res.sendStatus(401)
    const refreshToken = cookies.refreshToken

    const foundUser = await User.findOne({ refreshToken }).exec()
    if (!foundUser) return res.sendStatus(403)
        // console.log(foundUser) 

    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN,
        (err, decoded) => {
            if (err || foundUser.email !== decoded.email) return res.sendStatus(403)
            const roles = foundUser.type;
        //create new accessToken
            const accessToken = jwt.sign(
                { 
                    "UserInfo": {
                        "email": foundUser.email,
                        "roles": roles
                    }
                },
                process.env.ACCESS_TOKEN,
                { expiresIn: '1d' }
            )
            res.json({ accessToken, user: foundUser, roles })
        }
    )
}

module.exports = { handleRefresh }