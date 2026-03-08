const dashboardRoute = require('./dashboard-route')
const productRoute = require('./product-route')
const roleRoute = require('./role-route')
const categoryRoute = require('./product-categories')
const systemConfig = require('../../config/system')
const accountRoute = require('./account-route')
const authRoute = require('./auth-route')
const authMiddleware = require('../../middleware/admin/auth.middleware')
const profileRoute = require('./profile-route')

module.exports = (app) => {
    const PATH_ADMIN = systemConfig.prefixAdmin
    // Public auth routes (login/logout)
    app.use(PATH_ADMIN + '/auth', authRoute)

    // Protect remaining admin routes with authentication middleware
    app.use(PATH_ADMIN + '/dashboard', authMiddleware.requiereAuthentication, dashboardRoute)
    app.use(PATH_ADMIN + '/products', authMiddleware.requiereAuthentication, productRoute)
    app.use(PATH_ADMIN + '/categories', authMiddleware.requiereAuthentication, categoryRoute)
    app.use(PATH_ADMIN + '/roles', authMiddleware.requiereAuthentication, roleRoute)
    app.use(PATH_ADMIN + '/accounts', authMiddleware.requiereAuthentication, accountRoute)
    app.use(PATH_ADMIN + '/profile', authMiddleware.requiereAuthentication, profileRoute)
}


