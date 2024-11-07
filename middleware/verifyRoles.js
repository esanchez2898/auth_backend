const verifyRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req?.roles) return res.sendStatus(401)

        const rolesArray = [...allowedRoles]
        console.log("rolesArray: ", rolesArray)
        console.log('req.roles: ', req.roles)
        
        // Si req.roles es un número, conviértelo en un array para comparar
        const userRoles = Array.isArray(req.roles) ? req.roles : [req.roles];
        
        // Verifica si alguno de los roles de usuario está en allowedRoles
        const result = userRoles.some(role => rolesArray.includes(role));

        
        if (!result) return res.sendStatus(401)
        next()
    }
}

module.exports = verifyRoles