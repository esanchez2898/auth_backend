/*Este archivo es un middleware personalizado que se enfoca en permitir el uso de cookies y credenciales (como tokens de sesión o encabezados de autorización) en solicitudes CORS cuando el origen está permitido.

Verifica si el origen de la solicitud está en allowedOrigins.
Si está permitido, agrega el encabezado Access-Control-Allow-Credentials: true, lo que indica al navegador que puede enviar cookies y credenciales.
Esto es importante si necesitas autenticación o sesiones, ya que permite que las solicitudes cross-origin incluyan esas credenciales.

*/

const allowedOrigins = require('../config/allowedOrigins');

const credentials = (req, res, next) => {                           // Middleware function to set Access-Control-Allow-Credentials header if the origin is allowed
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.header('Access-Control-Allow-Credentials', true);       // Sets the Access-Control-Allow-Credentials header to allow cookies and credentials for allowed origins
    }
    next();                                                         // Proceed to the next middleware
}

module.exports = credentials;
