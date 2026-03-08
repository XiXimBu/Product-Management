const express = require('express')
const route = express.Router()
const controller = require('../../controller/admin/product-controller')
const validate = require('../../validate/admin/product-validate')
const uploadMiddleware = require('../../middleware/admin/upload.middleware')
const permission = require('../../middleware/admin/permission.middleware')

route.get('/', permission.requirePermission('product_view'), controller.product)

route.get('/edit/:id', permission.requirePermission('product_edit'), controller.edit)

route.get('/detail/:id', permission.requirePermission('product_view'), controller.detail)

// Support POST -> PATCH conversion for edit (via method-override)
// Support POST -> PATCH conversion for edit (via method-override)
route.post('/edit/:id', permission.requirePermission('product_edit'), uploadMiddleware.uploadThumbnail, validate.CreatPost, controller.editPatch)

route.patch('/edit/:id', permission.requirePermission('product_edit'), uploadMiddleware.uploadThumbnail, validate.CreatPost, controller.editPatch)

route.get('/trash', permission.requirePermission('product_view'), controller.trash)

route.get('/create', permission.requirePermission('product_create'), controller.create)

route.post('/create', permission.requirePermission('product_create'), uploadMiddleware.uploadThumbnail, validate.CreatPost, controller.createPost)

// Support POST -> PATCH for status changes
route.post('/change-status/:status/:id', permission.requirePermission('product_edit'), controller.changeStatus)
route.patch('/change-status/:status/:id', permission.requirePermission('product_edit'), controller.changeStatus)

route.post('/change-multi', permission.requirePermission('product_edit'), controller.changeMulti)
route.patch('/change-multi', permission.requirePermission('product_edit'), controller.changeMulti)

route.delete('/delete/:id', permission.requirePermission('product_delete'), controller.delete)

route.patch('/restore/:id', permission.requirePermission('product_delete'), controller.restore)

route.delete('/delete-permanent/:id', permission.requirePermission('product_delete'), controller.deletePermanent)

module.exports = route