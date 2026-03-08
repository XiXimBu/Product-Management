const Role = require('../../models/role-model')
const moment = require('moment')
const { prefixAdmin } = require('../../config/system')
const AVAILABLE_PERMISSIONS = require('../../config/permissions')

// Lookup map built once at startup
const PERM_MAP = new Map(AVAILABLE_PERMISSIONS.map(p => [p.id, p.name]))

// Normalize permissions field from req.body (string | array | undefined -> array)
const parsePermissions = (raw) => {
    if (!raw) return []
    return Array.isArray(raw) ? raw : [raw]
}

// ─── [GET] /admin/roles ────────────────────────────────────────────────────
module.exports.role = async (req, res) => {
    try {
        const records = await Role.find({ deletedAt: null }).lean()

        records.forEach(r => {
            r.permissionNames = (r.permissions || []).map(id => PERM_MAP.get(id) || id)
            r.createdByName = r.createdBy && r.createdBy.name ? r.createdBy.name : '-'
            r.createdAtFormatted = r.createdAt ? moment(r.createdAt).format('YYYY-MM-DD HH:mm') : '-'
        })

        res.render('admin/pages/roles/index', { pageTitle: 'Quản lý vai trò', records })
    } catch (err) {
        console.error(err)
        req.flash('error', 'Có lỗi khi tải danh sách vai trò!')
        res.redirect(`${prefixAdmin}/dashboard`)
    }
}

// ─── [GET] /admin/roles/create ────────────────────────────────────────────
module.exports.roleCreate = (_req, res) => {
    res.render('admin/pages/roles/create', {
        pageTitle: 'Tạo vai trò mới',
        permissions: AVAILABLE_PERMISSIONS
    })
}

// ─── [POST] /admin/roles/create ───────────────────────────────────────────
module.exports.createPost = async (req, res) => {
    const { name, description } = req.body

    try {
        const exists = await Role.findOne({ name, deletedAt: null })
        if (exists) {
            req.flash('error', 'Vai trò này đã tồn tại!')
            return res.render('admin/pages/roles/create', {
                pageTitle: 'Tạo vai trò mới',
                permissions: AVAILABLE_PERMISSIONS,
                data: req.body
            })
        }

        const actor = req.user ? { id: String(req.user._id), name: req.user.fullName } : { id: null, name: 'unknown' }

        const newRole = await Role.create({
            name,
            description,
            permissions: parsePermissions(req.body.permissions),
            status: 'active',
            createdBy: actor
        })

        // Log creation action (who, when, what)
        try {
            const actor = req.user ? { id: req.user._id, name: req.user.fullName } : { id: null, name: 'unknown' }
            const log = {
                action: 'create',
                roleId: String(newRole._id),
                actor,
                timestamp: moment().format('YYYY-MM-DD HH:mm:ss'),
                data: { name, description, permissions: parsePermissions(req.body.permissions) }
            }
            console.info('Role action log:', JSON.stringify(log, null, 2))
        } catch (logErr) {
            console.error('Failed to write role creation log:', logErr)
        }

        req.flash('success', 'Tạo vai trò thành công!')
        res.redirect(`${prefixAdmin}/roles`)
    } catch (err) {
        console.error(err)
        req.flash('error', 'Tạo vai trò thất bại! Vui lòng thử lại.')
        res.render('admin/pages/roles/create', {
            pageTitle: 'Tạo vai trò mới',
            permissions: AVAILABLE_PERMISSIONS,
            data: req.body
        })
    }
}

// ─── [GET] /admin/roles/edit/:id ──────────────────────────────────────────
module.exports.roleEdit = async (req, res) => {
    try {
        const role = await Role.findOne({ _id: req.params.id, deletedAt: null }).lean()
        if (!role) {
            req.flash('error', 'Vai trò không tồn tại!')
            return res.redirect(`${prefixAdmin}/roles`)
        }

        res.render('admin/pages/roles/edit', {
            pageTitle: 'Chỉnh sửa vai trò',
            role,
            permissions: AVAILABLE_PERMISSIONS
        })
    } catch (err) {
        console.error(err)
        req.flash('error', 'Có lỗi khi tải thông tin vai trò!')
        res.redirect(`${prefixAdmin}/roles`)
    }
}

// ─── [PATCH] /admin/roles/edit/:id ────────────────────────────────────────
module.exports.editPost = async (req, res) => {
    const { id } = req.params
    const { name, description } = req.body

    try {
        const role = await Role.findOne({ _id: id, deletedAt: null })
        if (!role) {
            req.flash('error', 'Vai trò không tồn tại!')
            return res.redirect(`${prefixAdmin}/roles`)
        }

        if (name !== role.name) {
            const duplicate = await Role.findOne({ name, deletedAt: null, _id: { $ne: id } })
            if (duplicate) {
                req.flash('error', 'Tên vai trò này đã tồn tại!')
                return res.render('admin/pages/roles/edit', {
                    pageTitle: 'Chỉnh sửa vai trò',
                    role: { ...role.toObject(), ...req.body },
                    permissions: AVAILABLE_PERMISSIONS
                })
            }
        }

        const actor = req.user ? { id: String(req.user._id), name: req.user.fullName } : { id: null, name: 'unknown' }

        const updated = await Role.findByIdAndUpdate(id, {
            name,
            description,
            permissions: parsePermissions(req.body.permissions),
            updatedBy: actor
        }, { new: true })

        // Log update action (who, when, changes)
        try {
            const actor = req.user ? { id: req.user._id, name: req.user.fullName } : { id: null, name: 'unknown' }
            const log = {
                action: 'update',
                roleId: String(id),
                actor,
                timestamp: moment().format('YYYY-MM-DD HH:mm:ss'),
                data: { name, description, permissions: parsePermissions(req.body.permissions) },
                result: updated ? 'ok' : 'not_found'
            }
            console.info('Role action log:', JSON.stringify(log, null, 2))
        } catch (logErr) {
            console.error('Failed to write role update log:', logErr)
        }

        req.flash('success', 'Chỉnh sửa vai trò thành công!')
        res.redirect(`${prefixAdmin}/roles`)
    } catch (err) {
        console.error(err)
        req.flash('error', 'Chỉnh sửa vai trò thất bại! Vui lòng thử lại.')
        res.redirect(`${prefixAdmin}/roles/edit/${id}`)
    }
}

// ─── [DELETE] /admin/roles/delete/:id ─────────────────────────────────────
module.exports.deleteRole = async (req, res) => {
    try {
        const role = await Role.findByIdAndUpdate(
            req.params.id,
            { deletedAt: new Date() },
            { new: true }
        )

        if (!role) return res.json({ code: 404, message: 'Vai trò không tồn tại' })

        res.json({ code: 200, message: 'Xóa vai trò thành công' })
    } catch (err) {
        console.error(err)
        res.json({ code: 500, message: 'Xóa vai trò thất bại' })
    }
}

// ─── [GET] /admin/roles/permissions ───────────────────────────────────────
module.exports.permissions = (_req, res) => {
    res.json({ code: 200, permissions: AVAILABLE_PERMISSIONS })
}

module.exports.getAvailablePermissions = () => AVAILABLE_PERMISSIONS
