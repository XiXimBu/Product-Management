const express = require('express')
const route = express.Router()
const controller = require('../../controller/admin/auth-controller')
const validate = require('../../validate/admin/auth-validate')

route.get('/login', controller.login)

route.post('/login', validate.login, controller.loginPost)

route.get('/logout', controller.logout)

module.exports = route