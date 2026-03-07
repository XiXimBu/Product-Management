const mongoose = require('mongoose');
const mongooseSlugUpdater = require('mongoose-slug-updater');

mongoose.plugin(mongooseSlugUpdater);

const productCategorySchema = new mongoose.Schema(
{
  title: String,
  parent_id: {
    default: "",
    type: String
  },
  description: String,
  thumbnail: String,
  status: String,
  position: Number,
  deleted: Boolean,
  slug: { type: String, slug: "title", unique: true },
  deletedAt: Date
}
, { timestamps: true });

const ProductCategory = mongoose.model('ProductCategory', productCategorySchema, 'products-categories'); // (Model name, Schema, Collection name)
module.exports = ProductCategory; 