// ======================
// 1. Core & Third-party Modules
// ======================
const express = require('express');
const methodOverride = require('method-override');
require('dotenv').config();
const session = require('express-session')
const cookieParser = require('cookie-parser')
const path = require('path')
const flashMiddleware = require('./middleware/flash.middleware')

// ======================
// 2. App Initialization
// ======================
const app = express();
const port = process.env.PORT || 3000;


// ======================
// 3. Database Connection
// ======================
const database = require('./config/database');
database.connect();


// ======================
// 4. System Config
// ======================
const systemConfig = require('./config/system');


// ======================
// 5. View Engine Setup
// ======================
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');


// ======================
// 6. Global App Variables
// ======================
app.locals.prefixAdmin = systemConfig.prefixAdmin;


// ======================
// 7. Middlewares
// ======================
app.use(express.urlencoded({ extended: true })); // Parse form data
// Support method override from body field `_method` (hidden input)
app.use(methodOverride('_method'));
// Also support method override via query string `?_method=PATCH` used by some scripts
app.use(methodOverride((req) => {
  if (req.query && req.query._method) return req.query._method
}));
app.use(express.static(path.join(__dirname, 'public'))); // Static files (css, js, images)
app.use(cookieParser(process.env.KEY_BOARD_CAT));
app.use(session({
  secret: process.env.KEY_BOARD_CAT,
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 600000 } // 10 phút
}));
app.use(flashMiddleware);

// Middleware để truyền flash messages vào locals
app.use((req, res, next) => {
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
});

// ======================
// 8. Routes
// ======================
const routeClient = require('./routes/client/index-route');
const routeAdmin = require('./routes/admin/index-route');

routeClient(app);
routeAdmin(app);

// ======================
// 9. Start Server (Local only)
// ======================
// Vercel uses serverless functions, so app must be exported without binding a port.
if (!process.env.VERCEL) {
  app.listen(port, () => {
    console.log(`App listening on port ${port}`);
  });
}

module.exports = app;