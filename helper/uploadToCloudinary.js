const cloudinary = require('../config/cloudinary')

module.exports = async (file) => {
  if (!file || !file.buffer) return null

  const dataUri = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`
  const result = await cloudinary.uploader.upload(dataUri, {
    folder: 'product-management',
    resource_type: 'auto'
  })

  return result.secure_url
}
