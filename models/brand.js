const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const BrandSchema = new Schema({
  name: { type: String, required: true, maxLength: 30 },
});

BrandSchema.virtual("url_route").get(function () {
  return `/brands/${this._id}`;
});

// Export Model
module.exports = mongoose.model("Brand", BrandSchema);
