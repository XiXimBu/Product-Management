const express = require('express')
const route = express.Router()
const multer  = require('multer')
const systemConfig = require('../../config/system')
const upload = multer({
	storage: multer.memoryStorage(),
	limits: { fileSize: 5 * 1024 * 1024 },
	fileFilter: (req, file, cb) => {
		const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
		if (allowedMimeTypes.includes(file.mimetype)) return cb(null, true)
		cb(new Error('INVALID_FILE_TYPE'))
	}
})
const controller = require('../../controller/admin/product-controller')
const validate = require('../../validate/admin/product-validate')

const uploadThumbnail = (req, res, next) => {
	upload.single('thumbnail')(req, res, (error) => {
		if (error) {
			req.flash('error', 'Ảnh không hợp lệ (jpg/png/gif/webp, tối đa 5MB)!')
			const fallbackPath = req.params.id
				? `${systemConfig.prefixAdmin}/products/edit/${req.params.id}`
				: `${systemConfig.prefixAdmin}/products/create`
			return res.redirect(fallbackPath)
		}
		next()
	})
}

route.get('/', controller.product)

route.get('/edit/:id', controller.edit)
route.get('/detail/:id', controller.detail)

route.patch('/edit/:id', uploadThumbnail, validate.CreatPost, controller.editPatch)

route.get('/trash', controller.trash)

route.get('/create', controller.create)

route.post('/create', uploadThumbnail, validate.CreatPost, controller.createPost)

route.patch('/change-status/:status/:id', controller.changeStatus)

route.patch('/change-multi', controller.changeMulti)

route.delete('/delete/:id', controller.delete)

route.patch('/restore/:id', controller.restore)

route.delete('/delete-permanent/:id', controller.deletePermanent)

module.exports = route