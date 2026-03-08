const Account = require('../../models/account-model')
const uploadToCloudinary = require('../../helper/uploadToCloudinary')

// [Get] / admin/profile

module.exports.getProfile = (req, res) => {
     res.render("admin/pages/profile/index", {
            pageTitle: "Hồ sơ cá nhân"
     });
}

// [PATCH] / admin/profile/update

module.exports.updateProfile = async (req, res) => {
     try {
          // req.user is a plain object from middleware; use _id to lookup document
          const userId = req.user && req.user._id
          if (!userId) return res.status(401).json({ message: 'Unauthorized' })

          const body = req.body || {}
          const { fullName, phone, email, about } = body

          // basic validation: prevent changing role
          const account = await Account.findOne({ _id: userId, deleted: false })
          if (!account) return res.status(404).json({ message: 'User not found' })

          // check unique email/phone (exclude current user)
          if (email) {
               const found = await Account.findOne({ email: email, deleted: false, _id: { $ne: account._id } })
               if (found) return res.status(400).json({ message: 'Email already in use' })
          }
          if (phone) {
               const found = await Account.findOne({ phone: phone, deleted: false, _id: { $ne: account._id } })
               if (found) return res.status(400).json({ message: 'Phone already in use' })
          }

          // Apply allowed updates only
          if (typeof fullName !== 'undefined') account.fullName = fullName
          if (typeof phone !== 'undefined') account.phone = phone
          if (typeof email !== 'undefined') account.email = email
          if (typeof about !== 'undefined') account.about = about

          // Optional avatar update via multer + Cloudinary
          if (req.file) {
               try {
                    const avatarUrl = await uploadToCloudinary(req.file)
                    if (avatarUrl) account.avatar = avatarUrl
               } catch (uploadError) {
                    console.error(uploadError)
                    return res.status(500).json({ message: 'Upload ảnh thất bại' })
               }
          }

          await account.save()

          return res.json({ message: 'Cập nhật thông tin cá nhân thành công' })
     } catch (err) {
          console.error(err)
          return res.status(500).json({ message: 'Server error' })
     }
}