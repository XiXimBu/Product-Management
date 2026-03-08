const mongoose = require('mongoose');
const mongooseSlugUpdater = require('mongoose-slug-updater');

mongoose.plugin(mongooseSlugUpdater);

const productSchema = new mongoose.Schema(
{
  title: String,
  description: String,
  category_id: {
    type: String,
    default: ""
  },
  price: Number,
  discountPercentage: Number,
  stock: Number,
  thumbnail: String,
  status: String,
  position: Number,
  deleted: Boolean,
  // Audit fields
  createdBy: {
    id: { type: String, default: null },
    name: { type: String, default: '' }
  },
  updatedBy: {
    id: { type: String, default: null },
    name: { type: String, default: '' }
  },
  slug: { type: String, slug: "title", unique: true },
  deletedAt: Date
}
, { timestamps: true });

const Product = mongoose.model('Product', productSchema, 'products');// (Model name, Schema, Collection name)
module.exports = Product; 