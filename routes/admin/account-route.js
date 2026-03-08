const express = require('express')
const route = express.Router()
const controller = require('../../controller/admin/account-controller')
const uploadMiddleware = require('../../middleware/admin/upload.middleware')
const permission = require('../../middleware/admin/permission.middleware')

route.get('/', permission.requirePermission('role_view'), controller.account)

route.get('/create', permission.requirePermission('role_create'), controller.accountCreate)

route.post('/create', permission.requirePermission('role_create'), uploadMiddleware.uploadAvatar, controller.createPost)

route.get('/edit/:id', permission.requirePermission('role_edit'), controller.accountEdit)

route.post('/edit/:id', permission.requirePermission('role_edit'), uploadMiddleware.uploadAvatar, controller.editPost)

module.exports = route