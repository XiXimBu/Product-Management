const Account = require('../../models/account-model')
const Role = require('../../models/role-model')
const { prefixAdmin } = require('../../config/system')
const AVAILABLE_PERMISSIONS = require('../../config/permissions')
const uploadToCloudinary = require('../../helper/uploadToCloudinary')
var md5 = require('md5');

const parsePermissions = (raw) => {
    if (!raw) return []
    return Array.isArray(raw) ? raw : [raw]
}

const escapeRegExp = (string) => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

// [Get] / admin/accounts
module.exports.account = async (req, res) => {
    try {
        const find = { deleted: false }
        const records = await Account.find(find).lean()

        // Resolve role_id -> role name for display
        const roleIds = [...new Set(records.map(r => r.role_id).filter(Boolean))]
        let roles = []
        if (roleIds.length) {
            roles = await Role.find({ _id: { $in: roleIds } }).lean()
        }
        const roleMap = new Map(roles.map(r => [String(r._id), r.name]))
        records.forEach(r => {
            r.roleName = r.role_id ? (roleMap.get(String(r.role_id)) || r.role_id) : null
        })

        res.render('admin/pages/accounts/index', {
            pageTitle: 'Danh sách Tài khoản',
            records: records
        })
    } catch (err) {
        console.error(err)
        req.flash('error', 'Lỗi khi tải danh sách tài khoản!')
        res.redirect(`${prefixAdmin}/dashboard`)
    }
}

// [Get] / admin/accounts/create
module.exports.accountCreate = async (req, res) => {
    try {
        const roles = await Role.find({ deletedAt: null }).lean()
        res.render('admin/pages/accounts/creat', {
            pageTitle: 'Tạo mới Tài khoản',
            roles,
            permissions: AVAILABLE_PERMISSIONS
        })
    } catch (err) {
        console.error(err)
        req.flash('error', 'Lỗi khi tải trang tạo mới tài khoản!')
        res.redirect(`${prefixAdmin}/dashboard`)
    }
}

// [Post] / admin/accounts/create
module.exports.createPost = async (req, res) => {
    try {
        const { fullName, email, password: rawPassword, phone, role_id, status } = req.body
        const permissions = parsePermissions(req.body.permissions)
        // Hash password using MD5 (consider using bcrypt for better security in production)
        const password = rawPassword ? md5(rawPassword) : null
        let avatarUrl = null

        // Load roles and check duplicates in parallel (faster and less verbose)
        const re = email ? new RegExp('^' + escapeRegExp(email) + '$', 'i') : null
        const rolesPromise = Role.find({ deletedAt: null }).lean()
        const emailPromise = email ? Account.findOne({ email: re, deleted: false }) : Promise.resolve(null)
        const phonePromise = phone ? Account.findOne({ phone: phone, deleted: false }) : Promise.resolve(null)

        const [roles, foundEmail, foundPhone] = await Promise.all([rolesPromise, emailPromise, phonePromise])

        const emailExists = !!foundEmail
        const phoneExists = !!foundPhone

        if (emailExists || phoneExists) {
            const msg = []
            if (emailExists) msg.push('Email đã tồn tại')
            if (phoneExists) msg.push('SĐT đã tồn tại')
            req.flash('error', msg.join(' và '))
            return res.render('admin/pages/accounts/creat', {
                pageTitle: 'Tạo mới Tài khoản',
                roles,
                permissions: AVAILABLE_PERMISSIONS,
                data: req.body
            })
        }

        // Only upload avatar after validation passed
        if (req.file) {
            try {
                avatarUrl = await uploadToCloudinary(req.file)
            } catch (e) {
                console.error('Cloudinary upload failed:', e)
            }
        }

        await Account.create({ fullName, email, password, phone, role_id, status, permissions, avatar: avatarUrl })

        req.flash('success', 'Tạo tài khoản thành công')
        res.redirect(`${prefixAdmin}/accounts`)
    } catch (err) {
        console.error(err)
        req.flash('error', 'Tạo tài khoản thất bại')
        res.redirect(`${prefixAdmin}/accounts/create`)
    }
}

// [Get] /admin/accounts/edit/:id
module.exports.accountEdit = async (req, res) => {
    try {
        const account = await Account.findOne({ _id: req.params.id, deleted: false }).lean()
        if (!account) {
            req.flash('error', 'Tài khoản không tồn tại!')
            return res.redirect(`${prefixAdmin}/accounts`)
        }
        const roles = await Role.find({ deletedAt: null }).lean()
        res.render('admin/pages/accounts/edit', {
            pageTitle: 'Chỉnh sửa Tài khoản',
            account,
            roles,
            permissions: AVAILABLE_PERMISSIONS
        })
    } catch (err) {
        console.error(err)
        req.flash('error', 'Lỗi khi tải trang chỉnh sửa!')
        res.redirect(`${prefixAdmin}/accounts`)
    }
}

// [Post] /admin/accounts/edit/:id
module.exports.editPost = async (req, res) => {
    try {
        const { fullName, email, password: rawPassword, phone, role_id, status } = req.body
        const permissions = parsePermissions(req.body.permissions)

        const account = await Account.findOne({ _id: req.params.id, deleted: false })
        if (!account) {
            req.flash('error', 'Tài khoản không tồn tại!')
            return res.redirect(`${prefixAdmin}/accounts`)
        }

        // Check duplicates (exclude current account)
        const re = email ? new RegExp('^' + escapeRegExp(email) + '$', 'i') : null
        const [foundEmail, foundPhone] = await Promise.all([
            email ? Account.findOne({ email: re, deleted: false, _id: { $ne: account._id } }) : Promise.resolve(null),
            phone ? Account.findOne({ phone, deleted: false, _id: { $ne: account._id } }) : Promise.resolve(null)
        ])

        if (foundEmail || foundPhone) {
            const msg = []
            if (foundEmail) msg.push('Email đã tồn tại')
            if (foundPhone) msg.push('SĐT đã tồn tại')
            req.flash('error', msg.join(' và '))
            return res.redirect(`${prefixAdmin}/accounts/edit/${req.params.id}`)
        }

        // Upload avatar nếu có file mới
        if (req.file) {
            try {
                account.avatar = await uploadToCloudinary(req.file)
            } catch (e) {
                console.error('Cloudinary upload failed:', e)
            }
        }

        account.fullName = fullName
        account.email = email
        account.phone = phone
        account.role_id = role_id
        account.status = status
        account.permissions = permissions
        if (rawPassword) account.password = md5(rawPassword)

        await account.save()
        req.flash('success', 'Cập nhật tài khoản thành công')
        res.redirect(`${prefixAdmin}/accounts`)
    } catch (err) {
        console.error(err)
        req.flash('error', 'Cập nhật tài khoản thất bại')
        res.redirect(`${prefixAdmin}/accounts/edit/${req.params.id}`)
    }
}

