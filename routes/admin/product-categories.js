const express = require('express')
const route = express.Router()
const controller = require('../../controller/admin/categories-controller')
const validate = require('../../validate/admin/categories-validate.js')
const uploadMiddleware = require('../../middleware/admin/upload.middleware')


route.get('/', controller.categories)

route.get('/create', controller.create)

route.post('/create', uploadMiddleware.uploadThumbnail, validate.categories, controller.createPost)

route.get('/edit/:id', controller.edit)

route.patch('/edit/:id', uploadMiddleware.uploadThumbnail, validate.categories, controller.editPatch)

route.patch('/change-status/:id', controller.changeStatus)

route.delete('/delete/:id', controller.delete)

module.exports = route