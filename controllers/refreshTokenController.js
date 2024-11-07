const db = require('../db.js')
const jwt = require('jsonwebtoken')
require('dotenv').config()


const handleRefresh = async (req, res) => {
    const cookies = req.cookies
    if (!cookies?.jwt) return res.sendStatus(401) // 401 Unauthorized
    console.log("testtt refreshhhhhh: ", cookies.jwt)
    const refreshToken = cookies.jwt


    const foundUser = await db('test_users').where({ refresh_token: refreshToken }).first()
    console.log("foundUser: ", foundUser)
    if (!foundUser) return res.sendStatus(403)  // 403 Forbidden

    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        async (err, decoded) => {
            if (err || foundUser.username !== decoded.username) return res.sendStatus(403)  // 403 Forbidden

            //const roles2 = Object.values(foundUser.roles)
            const roles = await db('test_user_roles').where({ user_id: foundUser.user_id }).first()
            console.log("roles: ", roles)
            const accessToken = jwt.sign(
                {
                    "UserInfo": {
                        "username": decoded.username,
                        "roles": roles.role_id
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '300s' }
            )
            res.json({ accessToken })
        }
    )

}

module.exports = { handleRefresh }