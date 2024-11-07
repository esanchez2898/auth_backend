const db = require('../db.js')

const handleLogout = async (req, res) => {
    // On client, also delete the accessToken

    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(204); //No content
    const refreshToken = cookies.jwt;

    // Is refreshToken in db?
    const foundUser = await db('test_users').where({ refresh_token: refreshToken }).first()
    if (!foundUser) {
        res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
        return res.sendStatus(203);
    }

    // Delete refreshToken in db
    await db('test_users')
            .where({ username: foundUser.username  }) // Encuentra al usuario por su username
            .update({
                refresh_token: null, // Establece el refresh_token en null
                updated_at: db.fn.now() // Opcional: registra la fecha de actualización
            });

    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: false }); // secure: false just in develpment
    res.sendStatus(200);
}

module.exports = { handleLogout }