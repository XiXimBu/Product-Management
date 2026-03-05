const mongoose = require('mongoose');
const mongooseSlugUpdater = require('mongoose-slug-updater');

mongoose.plugin(mongooseSlugUpdater);

const productSchema = new mongoose.Schema(
{
  title: String,
  description: String,
  price: Number,
  discountPercentage: Number,
  stock: Number,
  thumbnail: String,
  status: String,
  position: Number,
  deleted: Boolean,
  slug: { type: String, slug: "title", unique: true },
  deletedAt: Date
}
, { timestamps: true });

const Product = mongoose.model('Product', productSchema, 'products');// (Model name, Schema, Collection name)
module.exports = Product; 