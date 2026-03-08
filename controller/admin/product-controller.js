const systemConfig = require('../../config/system')
const Product = require('../../models/product-model')
const moment = require('moment')

const filterStatusHelper = require('../../helper/filterStatus')
const searchStatusHelper = require('../../helper/searchStatus')
const paginationHelper = require('../../helper/paginationHelper')
const uploadToCloudinary = require('../../helper/uploadToCloudinary')
const getCategoriesTree = require('../../helper/getCategoriesTree')

// [Get] / admin/products 
module.exports.product = async (req, res) => {
  try {
    let find = {
      deleted: false
    };

    // filter status
    const filterStatus = filterStatusHelper(req.query)

    if (req.query.status) {
      find.status = req.query.status;
    }

    // search status
    const ObjectSearch = searchStatusHelper(req.query)

    if (ObjectSearch.keyword) {
      find.title = ObjectSearch.regex
    }

    // pagination
    const countProduct = await Product.countDocuments(find)
    let objectPagination = paginationHelper({
      currentPage: 1,
      limitItems: 3
    }, req.query,
      countProduct);

    const products = await Product.find(find).limit(objectPagination.limitItems).skip(objectPagination.skip).lean();

    // Attach createdBy name and formatted createdAt for display
    products.forEach(p => {
      p.createdByName = p.createdBy && p.createdBy.name ? p.createdBy.name : '-'
      p.createdAtFormatted = p.createdAt ? moment(p.createdAt).format('YYYY-MM-DD HH:mm') : '-'
      p.updatedByName = p.updatedBy && p.updatedBy.name ? p.updatedBy.name : '-'
      p.updatedAtFormatted = p.updatedAt ? moment(p.updatedAt).format('YYYY-MM-DD HH:mm') : '-'
    })

    res.render("admin/pages/products/index", {
      pageTitle: "Trang danh sách sản phẩm",
      products: products, // view ,controller
      filterStatus: filterStatus,
      keyword: ObjectSearch.keyword,
      pagination: objectPagination
    });
  } catch (error) {
    req.flash("error", "Có lỗi khi tải danh sách sản phẩm!")
    res.redirect(`${systemConfig.prefixAdmin}/products`)
  }
}


// [Patch] /admin/products/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
  try {
    await Product.updateOne({ _id: req.params.id },
      { status: req.params.status })//truyền vào đối số {Tìm xem thằng nào cần sửa?} và {Sửa cái gì và sửa thành cái gì?}

    req.flash("success", "Cập nhật trạng thái sản phẩm thành công!")

    const referer = req.get('referer') || '/admin/products'
    res.redirect(referer)
  } catch (error) {
    req.flash("error", "Cập nhật trạng thái thất bại!")
    const referer = req.get('referer') || '/admin/products'
    res.redirect(referer)
  }
}

// [Patch] /admin/products/change-multi
module.exports.changeMulti = async (req, res) => {
  try {
    const type = req.body.type
    const ids = req.body.ids.split(",").map(id => id.trim()) // Tách chuỗi thành mảng và loại bỏ khoảng trắng

    if (type === "deleted-all") {
      await Product.updateMany(
        { _id: { $in: ids } },
        { deleted: true }
      )
      req.flash("success", `Đã xóa ${ids.length} sản phẩm vào thùng rác!`)
    } else {
      await Product.updateMany(
        { _id: { $in: ids } },
        { status: type }
      )
      req.flash("success", `Đã cập nhật trạng thái ${ids.length} sản phẩm thành công!`)
    }

    const referer = req.get('referer') || '/admin/products'
    res.redirect(referer)
  } catch (error) {
    req.flash("error", "Thao tác hàng loạt thất bại!")
    const referer = req.get('referer') || '/admin/products'
    res.redirect(referer)
  }
}

// [Get] /admin/products/trash
module.exports.trash = async (req, res) => {
  try {
    let find = {
      deleted: true
    };

    const products = await Product.find(find);

    res.render("admin/pages/products/trash", {
      pageTitle: "Thùng rác sản phẩm",
      products: products
    });
  } catch (error) {
    req.flash("error", "Có lỗi khi tải thùng rác!")
    res.redirect(`${systemConfig.prefixAdmin}/products`)
  }
}

// [Delete] /admin/products/delete/:id
module.exports.delete = async (req, res) => {
  try {
    await Product.updateOne(
      { _id: req.params.id },
      {
        deleted: true,
        deletedAt: new Date()
      }
    )

    req.flash("success", "Đã xóa sản phẩm vào thùng rác!")

    const referer = req.get('referer') || '/admin/products'
    res.redirect(referer)
  } catch (error) {
    req.flash("error", "Xóa sản phẩm thất bại!")
    const referer = req.get('referer') || '/admin/products'
    res.redirect(referer)
  }
}

// [Patch] /admin/products/restore/:id
module.exports.restore = async (req, res) => {
  try {
    await Product.updateOne(
      { _id: req.params.id },
      { deleted: false }
    )

    req.flash("success", "Đã khôi phục sản phẩm thành công!")

    const referer = req.get('referer') || '/admin/products/trash'
    res.redirect(referer)
  } catch (error) {
    req.flash("error", "Khôi phục sản phẩm thất bại!")
    const referer = req.get('referer') || '/admin/products/trash'
    res.redirect(referer)
  }
}

// [Delete] /admin/products/delete-permanent/:id
module.exports.deletePermanent = async (req, res) => {
  try {
    await Product.deleteOne({ _id: req.params.id })

    req.flash("warning", "Đã xóa vĩnh viễn sản phẩm!")

    const referer = req.get('referer') || '/admin/products/trash'
    res.redirect(referer)
  } catch (error) {
    req.flash("error", "Xóa vĩnh viễn thất bại!")
    const referer = req.get('referer') || '/admin/products/trash'
    res.redirect(referer)
  }
}

// [get] /admin/products/create
module.exports.create = async (req, res) => {
  try {
    // Lấy danh sách danh mục dạng cây
    const categoriesTree = await getCategoriesTree()

    res.render("admin/pages/products/create", {
      pageTitle: "Tạo sản phẩm mới",
      categories: categoriesTree
    });
  } catch (error) {
    console.error('Error in create:', error)
    req.flash("error", "Có lỗi khi tải form tạo sản phẩm!")
    res.redirect(`${systemConfig.prefixAdmin}/products`)
  }
}

// [Post] /admin/products/create
module.exports.createPost = async (req, res) => {
  try {
    // Tự động set position = số lượng sản phẩm + 1 (xuống cuối)
    const countProducts = await Product.countDocuments({ deleted: false });

    // Chuyển đổi các field số từ string sang Number
    const productData = {
      title: req.body.title,
      description: req.body.description,
      category_id: req.body.category_id || '',
      price: parseFloat(req.body.price),
      discountPercentage: parseFloat(req.body.discountPercentage) || 0,
      stock: parseInt(req.body.stock),
      status: req.body.status,
      position: parseInt(req.body.position) || (countProducts + 1),
      deleted: false
    };
    
    if (req.file) {
      const imageUrl = await uploadToCloudinary(req.file)
      if (imageUrl) productData.thumbnail = imageUrl
    }

    const actor = req.user ? { id: String(req.user._id), name: req.user.fullName } : { id: null, name: 'unknown' }

    const newProduct = new Product(Object.assign(productData, { createdBy: actor }))
    await newProduct.save();

    req.flash("success", "Tạo sản phẩm thành công!");
    res.redirect(`${systemConfig.prefixAdmin}/products`);
  } catch (error) {
    console.error('Error creating product:', error)
    req.flash("error", "Tạo sản phẩm thất bại! Vui lòng kiểm tra lại dữ liệu.");
    res.redirect(`${systemConfig.prefixAdmin}/products/create`);
  }
}

//[Get] /admin/products/edit/:id
module.exports.edit = async (req, res) => {
  try {
    const find = {
      deleted: false,
      _id: req.params.id
    }
    const product = await Product.findOne(find);

    if (!product) {
      req.flash("error", "Sản phẩm không tồn tại hoặc đã bị xóa!")
      return res.redirect(`${systemConfig.prefixAdmin}/products`)
    }

    // Lấy danh sách danh mục dạng cây
    const categoriesTree = await getCategoriesTree()

    // Attach updater display fields
    product.updatedByName = product.updatedBy && product.updatedBy.name ? product.updatedBy.name : '-'
    product.updatedAtFormatted = product.updatedAt ? moment(product.updatedAt).format('YYYY-MM-DD HH:mm') : '-'

    res.render("admin/pages/products/edit", {
      pageTitle: "Chỉnh sửa sản phẩm",
      product: product,
      categories: categoriesTree
    });

  } catch (error) {
    console.error('Error in edit:', error)
    req.flash("error", "Sản phẩm không tồn tại hoặc đã bị xóa!")
    res.redirect(`${systemConfig.prefixAdmin}/products`)
  }
}

//[Patch] /admin/products/edit/:id
module.exports.editPatch = async (req, res) => {
  try {
    // Chuyển đổi các field số từ string sang Number
    const productData = {
      title: req.body.title,
      description: req.body.description,
      category_id: req.body.category_id || '',
      price: parseFloat(req.body.price),
      discountPercentage: parseFloat(req.body.discountPercentage) || 0,
      stock: parseInt(req.body.stock),
      status: req.body.status,
      position: parseInt(req.body.position) || 1
    };

    if (req.file) {
      const imageUrl = await uploadToCloudinary(req.file)
      if (imageUrl) productData.thumbnail = imageUrl
    }

    const actor = req.user ? { id: String(req.user._id), name: req.user.fullName } : { id: null, name: 'unknown' }
    await Product.updateOne({ _id: req.params.id }, { $set: Object.assign(productData, { updatedBy: actor }) });

    req.flash("success", "Chỉnh sửa sản phẩm thành công!");
    res.redirect(`${systemConfig.prefixAdmin}/products`);
  } catch (error) {
    console.error('Error editing product:', error)
    req.flash("error", "Chỉnh sửa sản phẩm thất bại! Vui lòng kiểm tra lại dữ liệu.");
    res.redirect(`${systemConfig.prefixAdmin}/products/edit/${req.params.id}`);
  }
}

//[Get] /admin/products/detail/:id
module.exports.detail = async (req, res) => {
  try {
    
  const find = {
     deleted: false,
    _id: req.params.id
  }
  const product = await Product.findOne(find);

    res.render("admin/pages/products/detail", {
    pageTitle: product.title,
    product: product
    });

  } catch (error) {
    req.flash("error", "Sản phẩm không tồn tại hoặc đã bị xóa!")
    res.redirect(`${systemConfig.prefixAdmin}/products`)
  }
}
