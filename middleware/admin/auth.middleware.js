const systemConfig = require('../../config/system')
const Account = require('../../models/account-model')
const Role = require('../../models/role-model')

module.exports.requiereAuthentication = async (req, res, next) => {
    if (!req.cookies.token) {
        return res.redirect(systemConfig.prefixAdmin + '/auth/login')
    }

    const user = await Account.findOne({ token: req.cookies.token }).lean()
    if (!user) {
        return res.redirect(systemConfig.prefixAdmin + '/auth/login')
    }

    // Lấy permissions và tên role từ Role mà account được gán
    if (user.role_id) {
        const role = await Role.findById(user.role_id).lean()
        // Combine role permissions and any account-level permissions (account override)
        const rolePerms = role ? (role.permissions || []) : []
        const accountPerms = Array.isArray(user.permissions) ? user.permissions : (user.permissions || [])
        // union
        user.permissions = Array.from(new Set([...rolePerms, ...accountPerms]))
        user.roleName = role ? role.name : null
    } else {
        user.permissions = Array.isArray(user.permissions) ? user.permissions : []
        user.roleName = null
    }

    // Gắn user vào request và locals để view có thể hiển thị
    user.roleId = user.role_id || null
    req.user = user
    res.locals.user = user
    // helper for templates
    res.locals.hasPermission = (perm) => {
        try {
            return Array.isArray(user.permissions) && user.permissions.includes(perm)
        } catch (e) {
            return false
        }
    }
   
    next()
}