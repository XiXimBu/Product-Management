// Helper function để lấy danh sách categories dạng cây
const ProductCategory = require('../models/product-categories.model')
const createTreeHelper = require('./createTreeHelper')

module.exports = async () => {
  try {
    const find = {
      deleted: false
    }

    // Lấy tất cả danh mục
    const records = await ProductCategory.find(find)

    // Chuyển đổi _id từ ObjectId sang String để dùng trong việc so sánh
    const recordsWithStringId = records.map(item => {
      const newItem = item.toObject()
      newItem.id = newItem._id.toString()
      return newItem
    })

    // Tạo cấu trúc cây đệ quy
    const categoriesTree = createTreeHelper(recordsWithStringId)

    return categoriesTree
  } catch (error) {
    console.error('Error in getCategoriesTree:', error)
    return []
  }
}
