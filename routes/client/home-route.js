const express = require('express')
const route = express.Router()
const HomeController = require('../../controller/client/home-controller')

route.get('/', HomeController.index)

module.exports = route