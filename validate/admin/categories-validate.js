module.exports.categories = (req, res, next) => {
  const { title, slug } = req.body

  if (!title || title.trim() === '') {
    req.flash('error', 'Tên danh mục không được để trống!')
    return res.redirect('/admin/categories')
  }

  if (title.length > 255) {
    req.flash('error', 'Tên danh mục không được vượt quá 255 ký tự!')
    return res.redirect('/admin/categories')
  }

  next()
}