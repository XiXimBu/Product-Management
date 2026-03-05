// ======================
// 1. Core & Third-party Modules
// ======================
const express = require('express');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
require('dotenv').config();
var flash = require('express-flash')
var session = require('express-session')
var cookieParser = require('cookie-parser')



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
app.set('views', './views');
app.set('view engine', 'pug');


// ======================
// 6. Global App Variables
// ======================
app.locals.prefixAdmin = systemConfig.prefixAdmin;


// ======================
// 7. Middlewares
// ======================
app.use(express.urlencoded({ extended: true })); // Parse form data
app.use(methodOverride('_method')); // Support PUT/PATCH/DELETE via ?_method=
app.use(express.static('public')); // Static files (css, js, images)
app.use(cookieParser(process.env.KEY_BOARD_CAT));
app.use(session({
  secret: process.env.KEY_BOARD_CAT,
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 600000 } // 10 phút
}));
app.use(flash());

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