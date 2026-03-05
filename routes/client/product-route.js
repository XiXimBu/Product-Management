const express = require('express')
const route = express.Router()
const ProductController = require('../../controller/client/products-controller')

route.get('/', ProductController.index)

route.get('/:slug', ProductController.detail)

module.exports = route