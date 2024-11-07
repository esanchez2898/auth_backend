const db = require('../db.js')
const bcrypt = require('bcrypt')

const handleNewUser = async (req, res) => {
    const { user, email, pwd } = req.body

    if (!user || !email || !pwd) return res.status(400).json({ 'message': 'username, email and password are require' })

    const duplicate = await db('test_users').where({ username: user }).first()
    if (duplicate) return res.sendStatus(409)

    try {
        const hashedPwd = await bcrypt.hash(pwd, 10)


        // Inicia una transacción
        await db.transaction(async trx => {
            // Inserta al usuario en la tabla `test_users` y obtén su ID
            const [userId] = await trx('test_users').insert(
                {
                    username: user,
                    password_hash: hashedPwd,
                    email,
                    created_at: db.fn.now()
                },
                ['user_id'] // Retorna el ID del nuevo usuario
            );

            // Verifica que el rol exista en `ROLES_LIST`
            /*const roleId = ROLES_LIST['User'];
            if (!roleId) {
                throw new Error(`El rol "${role}" no es válido.`);
            }*/

            await trx('test_user_roles').insert({
                user_id: userId.user_id,
                role_id: 2001, // hardcode, change in the future //////////////////////////
                assigned_at: db.fn.now()
            });
        });

        res.status(201).json({ 'success': `New user ${user} created` })
    } catch (err) {
        res.status(500).json({ 'message': err.message })
    }
}

module.exports = { handleNewUser }