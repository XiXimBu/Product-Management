const ProductCategory = require('../../models/product-categories.model')
const systemConfig = require('../../config/system')
const uploadToCloudinary = require('../../helper/uploadToCloudinary')
const getCategoriesTree = require('../../helper/getCategoriesTree')

// [Get] /admin/categories
module.exports.categories = async (req, res) => {
  try {
    // Lấy danh sách danh mục dạng cây
    const categoriesTree = await getCategoriesTree()

    res.render('admin/pages/catelogies/index', {
      pageTitle: 'Danh muc san pham',
      records: categoriesTree
    })
  } catch (error) {
    console.error('Error in categories:', error)
    req.flash('error', 'Có lỗi khi tải danh sách danh mục!')
    res.redirect(`${systemConfig.prefixAdmin}/dashboard`)
  }
}

// [Get] /admin/categories/create
module.exports.create = async (req, res) => {
  try {
    // Lấy danh sách danh mục dạng cây
    const categoriesTree = await getCategoriesTree()

    res.render('admin/pages/catelogies/create', {
      pageTitle: 'Thêm danh mục mới',
      records: categoriesTree
    })
  } catch (error) {
    console.error('Error in create:', error)
    req.flash('error', 'Có lỗi khi tải form tạo danh mục!')
    res.redirect(`${systemConfig.prefixAdmin}/categories`)
  }
}

// [POST] /admin/categories/create
module.exports.createPost = async (req, res) => {
  try {
    const countCategories = await ProductCategory.countDocuments({ deleted: false })

    const categoryData = {
      title: req.body.title,
      description: req.body.description,
      parent_id: req.body.parent_id || '',
      position: parseInt(req.body.position) || (countCategories + 1),
      status: req.body.status || 'inactive',
      deleted: false
    }

    if (req.body.slug && req.body.slug.trim()) {
      categoryData.slug = req.body.slug.trim()
    }

    if (req.file) {
      const imageUrl = await uploadToCloudinary(req.file)
      if (imageUrl) categoryData.thumbnail = imageUrl
    }

    const newCategory = new ProductCategory(categoryData)
    await newCategory.save()

    req.flash('success', 'Tạo danh mục thành công!')
    return res.redirect(`${systemConfig.prefixAdmin}/categories`)
  } catch (error) {
    console.error('Error creating category:', error)
    req.flash('error', 'Tạo danh mục thất bại! Vui lòng kiểm tra lại dữ liệu.')
    return res.redirect(`${systemConfig.prefixAdmin}/categories/create`)
  }
}

// [Get] /admin/categories/edit/:id
module.exports.edit = async (req, res) => {
  try {
    const id = req.params.id

    // Lấy danh mục hiện tại
    const category = await ProductCategory.findById(id)

    if (!category) {
      req.flash('error', 'Danh mục không tồn tại!')
      return res.redirect(`${systemConfig.prefixAdmin}/categories`)
    }

    // Lấy danh sách danh mục dạng cây
    const categoriesTree = await getCategoriesTree()

    res.render('admin/pages/catelogies/edit', {
      pageTitle: 'Chỉnh sửa danh mục',
      category: category,
      records: categoriesTree
    })
  } catch (error) {
    console.error('Error in edit:', error)
    req.flash('error', 'Có lỗi khi tải form chỉnh sửa danh mục!')
    res.redirect(`${systemConfig.prefixAdmin}/categories`)
  }
}

// [PATCH] /admin/categories/edit/:id
module.exports.editPatch = async (req, res) => {
  try {
    const id = req.params.id

    const updateData = {
      title: req.body.title,
      description: req.body.description,
      parent_id: req.body.parent_id || '',
      position: parseInt(req.body.position) || 0,
      status: req.body.status || 'inactive'
    }

    if (req.body.slug && req.body.slug.trim()) {
      updateData.slug = req.body.slug.trim()
    }

    if (req.file) {
      const imageUrl = await uploadToCloudinary(req.file)
      if (imageUrl) updateData.thumbnail = imageUrl
    }

    await ProductCategory.findByIdAndUpdate(id, updateData)

    req.flash('success', 'Cập nhật danh mục thành công!')
    return res.redirect(`${systemConfig.prefixAdmin}/categories`)
  } catch (error) {
    console.error('Error updating category:', error)
    req.flash('error', 'Cập nhật danh mục thất bại!')
    return res.redirect(`${systemConfig.prefixAdmin}/categories/edit/${req.params.id}`)
  }
}

// [PATCH] /admin/categories/change-status/:id
module.exports.changeStatus = async (req, res) => {
  try {
    const id = req.params.id

    // Lấy danh mục hiện tại
    const category = await ProductCategory.findById(id)

    if (!category) {
      req.flash('error', 'Danh mục không tồn tại!')
      return res.redirect(`${systemConfig.prefixAdmin}/categories`)
    }

    // Toggle status: active -> inactive, inactive -> active
    const newStatus = category.status === 'active' ? 'inactive' : 'active'

    await ProductCategory.findByIdAndUpdate(id, { status: newStatus })

    req.flash('success', `Thay đổi trạng thái danh mục thành công! `)
    return res.redirect(`${systemConfig.prefixAdmin}/categories`)
  } catch (error) {
    console.error('Error changing status:', error)
    req.flash('error', 'Thay đổi trạng thái danh mục thất bại!')
    return res.redirect(`${systemConfig.prefixAdmin}/categories`)
  }
}

// [DELETE] /admin/categories/delete/:id
module.exports.delete = async (req, res) => {
  try {
    const id = req.params.id

    const category = await ProductCategory.findById(id)

    if (!category) {
      req.flash('error', 'Danh mục không tồn tại!')
      return res.redirect(`${systemConfig.prefixAdmin}/categories`)
    }

    // Soft delete - chỉ set deleted = true
    await ProductCategory.findByIdAndUpdate(id, {
      deleted: true,
      deletedAt: new Date()
    })

    req.flash('success', 'Xóa danh mục thành công!')
    return res.redirect(`${systemConfig.prefixAdmin}/categories`)
  } catch (error) {
    console.error('Error deleting category:', error)
    req.flash('error', 'Xóa danh mục thất bại!')
    return res.redirect(`${systemConfig.prefixAdmin}/categories`)
  }
}