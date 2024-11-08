const express = require('express')
const router = express.Router()
const employeesControler = require('../../controllers/employeesControler')
const ROLES_LIST = require('../../config/roles_list')
const verifyRoles = require('../../middleware/verifyRoles')
const verifyJWT = require('../../middleware/verifyJWT') // protect individual routes

router.route('/')
    //.get(verifyJWT, employeesControler.getAllEmployees)// protect individual routes
    .get(verifyJWT, employeesControler.getAllEmployees)
    .post(verifyJWT, verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), employeesControler.createNewEmployee)
    .put(verifyJWT, verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), employeesControler.updateEmployee)
    .delete(verifyJWT, verifyRoles(ROLES_LIST.Admin), employeesControler.deleteEmployee)

router.route('/:id')
    .get(verifyJWT, employeesControler.getEmployee)

module.exports = router