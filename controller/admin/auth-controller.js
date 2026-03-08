const Account = require('../../models/account-model')
const md5 = require('md5')

// [Get] / admin/login
module.exports.login = async (req, res) => {
     const systemConfig = require('../../config/system')

     // Nếu đã có cookie token và token hợp lệ -> chuyển về dashboard
     if (req.cookies && req.cookies.token) {
          try {
               const account = await Account.findOne({ token: req.cookies.token })
               if (account && account.status === 'active') {
                    return res.redirect(`${systemConfig.prefixAdmin}/dashboard`)
               }
          } catch (err) {
               console.error('Error checking existing login token:', err)
          }
     }

     res.render("admin/pages/auth/login", {
            pageTitle: "Đăng nhập"
     });
}

// [Post] / admin/login
module.exports.loginPost = async (req, res) => {
     const { email, password } = req.body;
     const systemConfig = require('../../config/system');

     // 1. Tìm tài khoản theo email, chưa bị xoá
     const account = await Account.findOne({ email, deleted: false });

     if (!account) {
          req.flash('error', 'Email không tồn tại trong hệ thống!');
          return res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
     }

     // 2. Kiểm tra mật khẩu (md5)
     if (account.password !== md5(password)) {
          req.flash('error', 'Mật khẩu không chính xác!');
          return res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
     }

     // 3. Kiểm tra trạng thái tài khoản
     if (account.status !== 'active') {
          req.flash('error', 'Tài khoản đã bị khoá, vui lòng liên hệ quản trị viên!');
          return res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
     }

     // 4. Lưu token vào cookie và chuyển hướng vào trang admin
     res.cookie('token', account.token, { maxAge: 24 * 60 * 60 * 1000 }); // 1 ngày
     req.flash('success', `Chào mừng ${account.fullName} đã đăng nhập!`);
     res.redirect(`${systemConfig.prefixAdmin}/dashboard`);
}

// [Get] / admin/logout
module.exports.logout = (req, res) => {
     const systemConfig = require('../../config/system');
     req.flash('success', 'Bạn đã đăng xuất thành công.');
     res.clearCookie('token');
     res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
};