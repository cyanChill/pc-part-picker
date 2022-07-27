const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const CategorySchema = new Schema({
  name: { type: String, required: true, maxLength: 30 },
  imgPath: { type: String, required: true },
  description: { type: String, required: true },
});

CategorySchema.virtual("url_route").get(function () {
  return `/category/${this._id}`;
});

CategorySchema.virtual("public_imgPath").get(function () {
  return this.imgPath ? this.imgPath.slice(7) : "";
});

module.exports = mongoose.model("Category", CategorySchema);
