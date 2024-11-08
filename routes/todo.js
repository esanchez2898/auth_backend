const express = require('express')
const router = express.Router()
const path = require('path')
const verifyJWT = require('../middleware/verifyJWT') // protect individual routes

router.get('^/$|/todo(.html)?', verifyJWT, (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'todo.html'))   // 2
})

module.exports = router