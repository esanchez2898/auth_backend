const express = require('express')
const app = express()
const path = require('path')
const PORT = process.env.PORT || 3500




// Middleware

const { logger } = require('./middleware/logEvents')
const credentials = require('./middleware/credentials')
const cors = require('cors')
const corsOptions = require('./config/corsOptions')
const cookieParser = require('cookie-parser')
const verifyJWT = require('./middleware/verifyJWT')
const errorHandler = require('./middleware/errorHandler')




// Aplicación de Middlewares

app.use(logger)                                             // Custom middleware to log each HTTP request to a log file                 // ?
app.use(credentials);                                       // Primero, activa credenciales si el origen está permitido                 // ????
app.use(cors(corsOptions));                                 // Luego, configura las opciones CORS para definir quién puede acceder      // ?????????

app.use(express.urlencoded({ extended: false }))            // built-in middleware to handle urlcoded form data
app.use(express.json())                                     // built-in middleware for json
app.use(cookieParser())                                     // middleware for cookies

app.use(express.static(path.join(__dirname, '/public')))    // Sirve archivos estáticos desde la carpeta 'public'
//app.use('/subdir', express.static(path.join(__dirname, '/public')))






// 4. Definiendo Middlewares de las Rutas

app.use('/register', require('./routes/register'))
app.use('/auth', require('./routes/auth'))
app.use('/refresh', require('./routes/refresh'))
app.use('/logout', require('./routes/logout'))
//app.use('/subdir', require('./routes/subdir'))







// 5. Protección de Rutas con Autenticación
app.use('/', require('./routes/root'))
app.use(verifyJWT) // this is like a waterfall, so everithing after that it's going to be protected
app.use('/todo', require('./routes/todo'))
app.use('/employees', require('./routes/api/employees'))






// 6. Manejo de Errores para Rutas No Encontradas (404)

app.all('*', (req, res) => { // all http methods at ones
    res.status(404)
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'))
    } else if (req.accepts('json')) {
        res.json({ error: "404 Not Found" })
    } else {
        res.type('txt').send("404 Not Found")
    }
})






// 7. Manejo de Errores

app.use(errorHandler)






// 8. Arranque del Servidor

app.listen(PORT, () => console.log(`Running PORT ${PORT}`))

















/*

// Routes handlers
app.get('/hello(.html)?', (req, res, next) => {
    console.log('attempted to load hello.html')
    next()
}, (req, res) => {
    res.send('hello world')
})



//Chaining route handlers
const one = (req, res, next) => {
    console.log('one')
    next()
}

const two = (req, res, next) => {
    console.log('two')
    next()
}

const three = (req, res, next) => {
    console.log('three')
    res.send('finished')
}

app.get('/chain(.html)?', [one, two, three])

*/

// Others routes
/*app.get('/*', (req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'views', '404.html'))
})*/