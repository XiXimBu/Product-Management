module.exports.login = (req, res, next) => {
  const { email, password } = req.body

  if (!email || email.trim() === '') {
    req.flash('error', 'Email không được để trống!')
    return res.redirect('/admin/auth/login')
  }

  if (!password || password.trim() === '') {
    req.flash('error', 'Mật khẩu không được để trống!')
    return res.redirect('/admin/auth/login')
  }

  next()
}