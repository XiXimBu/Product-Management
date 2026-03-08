const Role = require('../../models/role-model')

// Static, memoized permission data so we don't rebuild arrays/maps on every call
const AVAILABLE_PERMISSIONS = [
    { id: 'product_view', name: 'Xem danh sách sản phẩm', category: 'Sản phẩm' },
    { id: 'product_create', name: 'Tạo sản phẩm', category: 'Sản phẩm' },
    { id: 'product_edit', name: 'Chỉnh sửa sản phẩm', category: 'Sản phẩm' },
    { id: 'product_delete', name: 'Xóa sản phẩm', category: 'Sản phẩm' },
    { id: 'category_view', name: 'Xem danh mục', category: 'Danh mục' },
    { id: 'category_create', name: 'Tạo danh mục', category: 'Danh mục' },
    { id: 'category_edit', name: 'Chỉnh sửa danh mục', category: 'Danh mục' },
    { id: 'category_delete', name: 'Xóa danh mục', category: 'Danh mục' },
    { id: 'role_view', name: 'Xem vai trò', category: 'Vai trò' },
    { id: 'role_create', name: 'Tạo vai trò', category: 'Vai trò' },
    { id: 'role_edit', name: 'Chỉnh sửa vai trò', category: 'Vai trò' },
    { id: 'role_delete', name: 'Xóa vai trò', category: 'Vai trò' }
]

const PERMISSION_MAP = AVAILABLE_PERMISSIONS.reduce((m, p) => {
    m[p.id] = p
    return m
}, {})

const PERMISSIONS_BY_CATEGORY = AVAILABLE_PERMISSIONS.reduce((grouped, perm) => {
    (grouped[perm.category] = grouped[perm.category] || []).push(perm)
    return grouped
}, {})

module.exports.getAvailablePermissions = () => AVAILABLE_PERMISSIONS.slice()
module.exports.getPermissionsByCategory = () => Object.assign({}, PERMISSIONS_BY_CATEGORY)
module.exports.getPermissionById = (permissionId) => PERMISSION_MAP[permissionId] || null
module.exports.permissionExists = (permissionId) => Boolean(PERMISSION_MAP[permissionId])

/**
 * Get all active roles
 * @returns {Promise<array>} Array of role documents
 */
module.exports.getAllActiveRoles = async () => {
    try {
        return await Role.find({ deletedAt: null }).lean()
    } catch (error) {
        console.error('Error fetching active roles:', error)
        throw error
    }
}

/**
 * Get role by ID
 * @param {string} roleId - Role ID
 * @returns {Promise<object>} Role document or null
 */
module.exports.getRoleById = async (roleId) => {
    try {
        const role = await Role.findById(roleId).lean()
        if (role && role.deletedAt) {
            return null
        }
        return role
    } catch (error) {
        console.error('Error fetching role:', error)
        throw error
    }
}

/**
 * Get role by name
 * @param {string} roleName - Role name
 * @returns {Promise<object>} Role document or null
 */
module.exports.getRoleByName = async (roleName) => {
    try {
        const role = await Role.findOne({ name: roleName, deletedAt: null }).lean()
        return role
    } catch (error) {
        console.error('Error fetching role:', error)
        throw error
    }
}

/**
 * Check if user has permission
 * @param {object} role - Role object
 * @param {string} permission - Permission to check
 * @returns {boolean}
 */
module.exports.checkPermission = (role, permission) => {
    if (!role || !permission) return false
    return Array.isArray(role.permissions) && role.permissions.includes(permission)
}

/**
 * Check if user has any of the permissions
 * @param {object} role - Role object
 * @param {array} permissions - Array of permission IDs
 * @returns {boolean}
 */
module.exports.hasAnyPermission = (role, permissions = []) => {
    if (!role || !Array.isArray(permissions)) return false
    return permissions.some(perm => module.exports.checkPermission(role, perm))
}

/**
 * Check if user has all permissions
 * @param {object} role - Role object
 * @param {array} permissions - Array of permission IDs
 * @returns {boolean}
 */
module.exports.hasAllPermissions = (role, permissions = []) => {
    if (!role || !Array.isArray(permissions)) return false
    return permissions.every(perm => module.exports.checkPermission(role, perm))
}

/**
 * Create a new role
 * @param {object} roleData - Role data {name, description, permissions}
 * @returns {Promise<object>} Created role document
 */
module.exports.createRole = async (roleData) => {
    try {
        // Validate permissions
        if (Array.isArray(roleData.permissions)) {
            roleData.permissions.forEach(permId => {
                if (!module.exports.permissionExists(permId)) {
                    throw new Error(`Invalid permission ID: ${permId}`)
                }
            })
        }

        const role = new Role({
            name: roleData.name,
            description: roleData.description || '',
            permissions: roleData.permissions || [],
            status: 'active'
        })

        await role.save()
        return role
    } catch (error) {
        console.error('Error creating role:', error)
        throw error
    }
}

/**
 * Update a role
 * @param {string} roleId - Role ID
 * @param {object} updateData - Update data
 * @returns {Promise<object>} Updated role document
 */
module.exports.updateRole = async (roleId, updateData) => {
    try {
        const role = await Role.findById(roleId)
        if (!role) {
            throw new Error('Role not found')
        }

        // Validate permissions if being updated
        if (Array.isArray(updateData.permissions)) {
            updateData.permissions.forEach(permId => {
                if (!module.exports.permissionExists(permId)) {
                    throw new Error(`Invalid permission ID: ${permId}`)
                }
            })
        }

        Object.assign(role, updateData)
        await role.save()
        return role
    } catch (error) {
        console.error('Error updating role:', error)
        throw error
    }
}

/**
 * Soft delete a role
 * @param {string} roleId - Role ID
 * @returns {Promise<boolean>} True if deleted successfully
 */
module.exports.deleteRole = async (roleId) => {
    try {
        const role = await Role.findById(roleId)
        if (!role) {
            throw new Error('Role not found')
        }

        role.deletedAt = new Date()
        await role.save()
        return true
    } catch (error) {
        console.error('Error deleting role:', error)
        throw error
    }
}

/**
 * Restore a soft-deleted role
 * @param {string} roleId - Role ID
 * @returns {Promise<boolean>} True if restored successfully
 */
module.exports.restoreRole = async (roleId) => {
    try {
        const role = await Role.findById(roleId)
        if (!role) {
            throw new Error('Role not found')
        }

        role.deletedAt = null
        await role.save()
        return true
    } catch (error) {
        console.error('Error restoring role:', error)
        throw error
    }
}

/**
 * Get permission name by ID
 * @param {string} permissionId - Permission ID
 * @returns {string} Permission name or empty string
 */
module.exports.getPermissionName = (permissionId) => {
    const permission = module.exports.getPermissionById(permissionId)
    return permission ? permission.name : ''
}

/**
 * Format permissions for display
 * @param {array} permissions - Array of permission IDs
 * @returns {array} Array of permission objects with names
 */
module.exports.formatPermissionsForDisplay = (permissions = []) => {
    return permissions
        .map(permId => {
            const permission = module.exports.getPermissionById(permId)
            return permission || { id: permId, name: 'Unknown', category: 'Other' }
        })
        .sort((a, b) => a.category.localeCompare(b.category))
}
