const express = require('express')
const router = express.Router()
const path = require('path')

router.get('^/$|/todo(.html)?', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'todo.html'))   // 2
})

module.exports = router