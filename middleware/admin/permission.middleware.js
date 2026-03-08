const Role = require('../../models/role-model')

/**
 * Check if user has specific permission
 * @param {string} requiredPermission - Permission to check
 * @returns {function} Middleware function
 */
module.exports.requirePermission = (requiredPermission) => {
    return async (req, res, next) => {
        try {
            // If user is admin (adjust based on your auth system)
            if (!req.user) {
                return res.status(401).json({
                    code: 401,
                    message: 'Unauthorized: User not found'
                })
            }

            // Get user's role
            const userRole = await Role.findById(req.user.roleId).lean()
            if (!userRole || userRole.deletedAt) {
                return res.status(403).json({
                    code: 403,
                    message: 'Forbidden: Role not found or has been deleted'
                })
            }

            // Check if user has permission
            if (!userRole.permissions || !userRole.permissions.includes(requiredPermission)) {
                return res.status(403).json({
                    code: 403,
                    message: 'Forbidden: You do not have permission to perform this action'
                })
            }

            // Add role info to request for later use
            req.userRole = userRole

            next()
        } catch (error) {
            console.error('Permission check error:', error)
            return res.status(500).json({
                code: 500,
                message: 'Internal server error during permission check'
            })
        }
    }
}

/**
 * Check if user has any of the specified permissions
 * @param {array} requiredPermissions - Array of permissions
 * @returns {function} Middleware function
 */
module.exports.requireAnyPermission = (requiredPermissions = []) => {
    return async (req, res, next) => {
        try {
            if (!req.user) {
                return res.status(401).json({
                    code: 401,
                    message: 'Unauthorized: User not found'
                })
            }

            const userRole = await Role.findById(req.user.roleId).lean()
            if (!userRole || userRole.deletedAt) {
                return res.status(403).json({
                    code: 403,
                    message: 'Forbidden: Role not found or has been deleted'
                })
            }

            const hasPermission = requiredPermissions.some(perm => 
                userRole.permissions && userRole.permissions.includes(perm)
            )

            if (!hasPermission) {
                return res.status(403).json({
                    code: 403,
                    message: 'Forbidden: You do not have any required permission'
                })
            }

            req.userRole = userRole
            next()
        } catch (error) {
            console.error('Permission check error:', error)
            return res.status(500).json({
                code: 500,
                message: 'Internal server error'
            })
        }
    }
}

/**
 * Check if user has all of the specified permissions
 * @param {array} requiredPermissions - Array of permissions
 * @returns {function} Middleware function
 */
module.exports.requireAllPermissions = (requiredPermissions = []) => {
    return async (req, res, next) => {
        try {
            if (!req.user) {
                return res.status(401).json({
                    code: 401,
                    message: 'Unauthorized: User not found'
                })
            }

            const userRole = await Role.findById(req.user.roleId).lean()
            if (!userRole || userRole.deletedAt) {
                return res.status(403).json({
                    code: 403,
                    message: 'Forbidden: Role not found or has been deleted'
                })
            }

            const hasAllPermissions = requiredPermissions.every(perm => 
                userRole.permissions && userRole.permissions.includes(perm)
            )

            if (!hasAllPermissions) {
                return res.status(403).json({
                    code: 403,
                    message: 'Forbidden: You do not have all required permissions'
                })
            }

            req.userRole = userRole
            next()
        } catch (error) {
            console.error('Permission check error:', error)
            return res.status(500).json({
                code: 500,
                message: 'Internal server error'
            })
        }
    }
}

/**
 * Helper function to check permission (can be used in templates)
 * @param {object} role - Role object
 * @param {string} permission - Permission to check
 * @returns {boolean}
 */
module.exports.hasPermission = (role, permission) => {
    if (!role || !permission) return false
    return role.permissions && role.permissions.includes(permission)
}

/**
 * Helper function to check multiple permissions
 * @param {object} role - Role object
 * @param {array} permissions - Array of permissions
 * @param {string} type - 'any' or 'all' (default: 'any')
 * @returns {boolean}
 */
module.exports.hasPermissions = (role, permissions = [], type = 'any') => {
    if (!role || !Array.isArray(permissions)) return false

    if (type === 'all') {
        return permissions.every(perm => 
            role.permissions && role.permissions.includes(perm)
        )
    }

    return permissions.some(perm => 
        role.permissions && role.permissions.includes(perm)
    )
}
