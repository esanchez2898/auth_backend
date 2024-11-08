const db = require('../db.js')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();



const handleLogin = async (req, res) => {
    const { email, pwd } = req.body;
    if (!email || !pwd) return res.status(400).json({ 'message': 'Email and password are required.' });


    const foundUser = await db('test_users').where({ email }).first()
   
    if (!foundUser) return res.sendStatus(401); //Unauthorized 

    // evaluate password 
    const match = await bcrypt.compare(pwd, foundUser.password_hash);
    if (match) {
   
        const roles = await db('test_user_roles').where({ user_id: foundUser.user_id }).first()

        // create JWTs
        const accessToken = jwt.sign(
            {
                "UserInfo": {
                    "id": foundUser.user_id,
                    "username": foundUser.username,
                    "roles": roles.role_id
                }
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '300s' }
        );

        const refreshToken = jwt.sign(
            { "username": foundUser.username },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '1d' }
        );


        // Saving refreshToken with current user
        await db('test_users')
            .where({ username: foundUser.username })
            .update({
                refresh_token: refreshToken, 
                updated_at: db.fn.now()
            });

        
        res.cookie('jwt', refreshToken, { httpOnly: true, sameSite: 'None', secure: false, maxAge: 24 * 60 * 60 * 1000 }); //  secure: false just in development
        res.json({ accessToken });
    } else {
        res.sendStatus(401);
    }
}





module.exports = { handleLogin };