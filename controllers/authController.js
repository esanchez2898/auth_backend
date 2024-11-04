const usersDB = {
    users: require('../model/users.json'),
    setUsers: function (data) { this.users = data }
}

const fsPromises = require('fs').promises;
const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();





const handleLogin = async (req, res) => {
    const { user, pwd } = req.body;
    if (!user || !pwd) return res.status(400).json({ 'message': 'Username and password are required.' });

    const foundUser = usersDB.users.find(person => person.username === user);
    if (!foundUser) return res.sendStatus(401); //Unauthorized 

    // evaluate password 
    const match = await bcrypt.compare(pwd, foundUser.password);
    if (match) {
        const roles = Object.values(foundUser.roles);


        // create JWTs
        const accessToken = jwt.sign(
            {
                "UserInfo": {
                    "username": foundUser.username,
                    "roles": roles
                }
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '30s' }
        );

        const refreshToken = jwt.sign(
            { "username": foundUser.username },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '1d' }
        );


        // Saving refreshToken with current user
        const otherUsers = usersDB.users.filter(person => person.username !== foundUser.username); /* [ { username: 'user1', password: 'pass1' }, { username: 'user3', password: 'pass3' } ]*/
        const currentUser = { ...foundUser, refreshToken }; /*{ username: 'user2', password: 'pass2', refreshToken: 'abc123' } */

        usersDB.setUsers([...otherUsers, currentUser]); /*[{ username: 'user1', password: 'pass1' },{ username: 'user3', password: 'pass3' },{ username: 'user2', password: 'pass2', refreshToken: 'abc123' }]*/

        // Guardar los Cambios en el Archivo:
        await fsPromises.writeFile(
            path.join(__dirname, '..', 'model', 'users.json'),
            JSON.stringify(usersDB.users)
        );

        
        res.cookie('jwt', refreshToken, { httpOnly: true, sameSite: 'None', secure: false, maxAge: 24 * 60 * 60 * 1000 }); //  secure: false just in development
        res.json({ accessToken });
    } else {
        res.sendStatus(401);
    }
}





module.exports = { handleLogin };