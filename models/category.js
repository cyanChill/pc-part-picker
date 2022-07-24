const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const CategorySchema = new Schema({
  name: { type: String, required: true, maxLength: 30 },
  previewImg: { type: String, required: true, maxLength: 200 },
  description: { type: String, required: true },
});

CategorySchema.virtual("url_route").get(function () {
  return `/category/${this._id}`;
});

// Export Model
module.exports = mongoose.model("Category", CategorySchema);
