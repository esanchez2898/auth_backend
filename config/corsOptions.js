/* Este archivo configura las opciones de CORS para tu servidor y especifica qué orígenes pueden acceder al backend en general.

Se asegura de que cada solicitud que viene de un dominio diferente sea verificada según las reglas que estableciste en corsOptions. 

Solo las solicitudes desde los dominios permitidos en allowedOrigins tendrán acceso a tu backend.*/




const allowedOrigins = require('./allowedOrigins');

const corsOptions = {
    origin: (origin, callback) => {
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {     // Checks if the request origin is in the allowedOrigins array or if there is no origin (for non-browser requests, e.g., Postman in development)
            callback(null, true);                                   // Allows the request
        } else {
            callback(new Error('Not allowed by CORS'));             // Blocks the request if the origin is not allowed
        }
    },
    optionsSuccessStatus: 200                                       // For older browsers that require a 200 status instead of the default 204 for preflight
};

module.exports = corsOptions;
