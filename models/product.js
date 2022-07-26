const mongoose = require("mongoose");

const simpHelpers = require("../helpers/simplifyHelper");

const Schema = mongoose.Schema;
const schemaOpt = { toJSON: { virtuals: true } };

const ProductSchema = new Schema(
  {
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    name: { type: String, required: true, maxLength: 100 },
    short_name: { type: String, required: true, maxLength: 50 },
    brand: { type: Schema.Types.ObjectId, ref: "Brand", required: true },
    price: { type: Number, required: true, min: 0, max: 99999.99 },
    image_url: { type: String, required: true },
    features: [
      {
        feature: { type: String, required: true, maxLength: 50 },
        description: { type: String, required: true, maxLength: 30 },
      },
    ],
    stock: { type: Number, required: true, min: 0, max: 999999999 },
  },
  schemaOpt
);

ProductSchema.virtual("buy_link").get(function () {
  return `https://www.amazon.com/s?k=${encodeURIComponent(this.name)}`;
});

ProductSchema.virtual("url_route").get(function () {
  return `/products/${this._id}`;
});

ProductSchema.virtual("simplifiedPrice").get(function () {
  return simpHelpers.simplifyFloatNum(this.price);
});

ProductSchema.virtual("simplifiedStock").get(function () {
  return simpHelpers.simplifyIntNum(this.stock);
});

// Export Model
module.exports = mongoose.model("Product", ProductSchema);
