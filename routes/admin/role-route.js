const express = require('express')
const route = express.Router()
const controller = require('../../controller/admin/role-controller')
const permission = require('../../middleware/admin/permission.middleware')

// Keep only routes used for rendering and submitting edits
route.get('/', permission.requirePermission('role_view'), controller.role)

// Render create page (GET) and handle create (POST)
route.get('/create', permission.requirePermission('role_create'), controller.roleCreate)
route.post('/create', permission.requirePermission('role_create'), controller.createPost)

// Edit: render edit form (GET) and submit changes (PATCH)
route.get('/edit/:id', permission.requirePermission('role_edit'), controller.roleEdit)

// Support POST -> PATCH conversion for edit (via method-override)
route.post('/edit/:id', permission.requirePermission('role_edit'), controller.editPost)
route.patch('/edit/:id', permission.requirePermission('role_edit'), controller.editPost)


module.exports = route