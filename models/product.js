const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ProductSchema = new Schema({
  category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
  name: { type: String, required: true },
  brand: { type: Schema.Types.ObjectId, ref: "Brand", required: true },
  price: { type: Number, required: true, min: 0 },
  image_url: { type: String },
  features: [
    {
      feature: { type: String, required: true },
      description: { type: String, required: true },
    },
  ],
  stock: { type: Number, required: true, min: 0 },
});

ProductSchema.virtual("buy_link").get(function () {
  return `https://www.amazon.com/s?k=${encodeURIComponent(this.name)}`;
});

// Export Model
module.exports = mongoose.model("Product", ProductSchema);
