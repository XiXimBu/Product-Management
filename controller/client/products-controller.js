
const Product = require('../../models/product-model')

// [Get] /products
module.exports.index = async (req, res) => {
  const products = await Product.find({
    status: "active",
    deleted: false
  });

  const newProducts = products.map(item => {
     item.newPrice = ((item.price * (100 - item.discountPercentage)) / 100).toFixed(2);
     return item;
  })

  res.render("client/pages/products/index", {
    pageTitle: "Trang sản phẩm",
    products: newProducts
  });
};

// [Get] /products/:slug
module.exports.detail = async (req, res) => {
  
  try {
  const { slug } = req.params;

  const product = await Product.findOne({
    slug: slug,
    status: "active",
    deleted: false
  });

  res.render("client/pages/products/detail", {
    pageTitle: "Chi tiết sản phẩm",
    product: product
  });
} catch (error) {
  res.status(404).render("client/pages/error/404");
}
}

