const express = require('express')
const route = express.Router()
const multer  = require('multer')
const storeageMulter = require('../../helper/storageMulter')
const upload = multer({ storage: storeageMulter() })
const controller = require('../../controller/admin/product-controller')
const validate = require('../../validate/admin/product-validate')

route.get('/', controller.product)

route.get('/edit/:id', controller.edit)
route.get('/detail/:id', controller.detail)

route.patch('/edit/:id', upload.single('thumbnail'), validate.CreatPost, controller.editPatch)

route.get('/trash', controller.trash)

route.get('/create', controller.create)

route.post('/create', upload.single('thumbnail'), validate.CreatPost, controller.createPost)

route.patch('/change-status/:status/:id', controller.changeStatus)

route.patch('/change-multi', controller.changeMulti)

route.delete('/delete/:id', controller.delete)

route.patch('/restore/:id', controller.restore)

route.delete('/delete-permanent/:id', controller.deletePermanent)

module.exports = route