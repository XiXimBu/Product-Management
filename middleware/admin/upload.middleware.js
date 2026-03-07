const multer = require('multer')
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

module.exports.uploadThumbnail = (req, res, next) => {
	upload.single('thumbnail')(req, res, (error) => {
		if (error) {
			req.flash('error', 'Ảnh không hợp lệ (jpg/png/gif/webp, tối đa 5MB)!')
			const basePath = req.baseUrl || `${systemConfig.prefixAdmin}/products`
			let fallbackPath = `${basePath}/create`

			if (basePath.endsWith('/categories')) {
				fallbackPath = basePath
			}

			if (req.params.id) {
				fallbackPath = `${basePath}/edit/${req.params.id}`
			}

			return res.redirect(fallbackPath)
		}
		next()
	})
}
