const express = require('express')
const route = express.Router()
const controller = require('../../controller/admin/profile-controller')
const uploadMiddleware = require('../../middleware/admin/upload.middleware')

route.get('/', controller.getProfile)
route.patch('/update', uploadMiddleware.uploadAvatarApi, controller.updateProfile)

module.exports = route