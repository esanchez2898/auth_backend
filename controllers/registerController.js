const usersDB = {
    users: require('../model/users.json'),                      // Load existing users from JSON
    setUsers: function (data) { this.users = data }             // Method to update users
}

/* import db from '../db.js'; */
const fsPromises = require('fs').promises;
const path = require('path');
const bcrypt = require('bcrypt');

const handleNewUser = async (req, res) => {
    const { user, pwd } = req.body;                             // Extract username and password

    if (!user || !pwd) return res.status(400).json({ 'message': 'username and password are require' });

    // Check for duplicate username

    //const userExist = await db('users').where({ email }).first();


    const duplicate = usersDB.users.find(person => person.username === user);
    if (duplicate) return res.sendStatus(409); // Conflict if username exists

    try {
        const hashedPwd = await bcrypt.hash(pwd, 10);   // Encrypt the password
        
        // Create a new user object
        const newUser = {
            "username": user,
            "roles": { "User": 2001 }, // Default role
            "password": hashedPwd // Hashed password
        };

        // Update users list and write to JSON file
        usersDB.setUsers([...usersDB.users, newUser]);
        await fsPromises.writeFile(
            path.join(__dirname, '..', 'model', 'users.json'),
            JSON.stringify(usersDB.users)
        );

        res.status(201).json({ 'success': `New user ${user} created` }); // Success response

    } catch (err) {
        res.status(500).json({ 'message': err.message }); // Error response
    }
}

module.exports = { handleNewUser }; // Export function
