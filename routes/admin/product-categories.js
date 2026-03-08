const express = require('express')
const route = express.Router()
const controller = require('../../controller/admin/categories-controller')
const validate = require('../../validate/admin/categories-validate.js')
const uploadMiddleware = require('../../middleware/admin/upload.middleware')
const permission = require('../../middleware/admin/permission.middleware')


route.get('/', permission.requirePermission('category_view'), controller.categories)

route.get('/create', permission.requirePermission('category_create'), controller.create)

route.post('/create', permission.requirePermission('category_create'), uploadMiddleware.uploadThumbnail, validate.categories, controller.createPost)

route.get('/edit/:id', permission.requirePermission('category_edit'), controller.edit)

// Support POST -> PATCH for edit (via method-override)
route.post('/edit/:id', permission.requirePermission('category_edit'), uploadMiddleware.uploadThumbnail, validate.categories, controller.editPatch)

route.patch('/edit/:id', permission.requirePermission('category_edit'), uploadMiddleware.uploadThumbnail, validate.categories, controller.editPatch)

// Support POST -> PATCH for status change
route.post('/change-status/:id', permission.requirePermission('category_edit'), controller.changeStatus)

route.patch('/change-status/:id', permission.requirePermission('category_edit'), controller.changeStatus)

route.delete('/delete/:id', permission.requirePermission('category_delete'), controller.delete)

// Trash / Restore / Delete permanent
route.get('/trash', permission.requirePermission('category_view'), controller.trash)

route.patch('/restore/:id', permission.requirePermission('category_delete'), controller.restore)

route.delete('/delete-permanent/:id', permission.requirePermission('category_delete'), controller.deletePermanent)

module.exports = route