const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const BrandSchema = new Schema({
  name: { type: String, required: true },
});

// Export Model
module.exports = mongoose.model("Brand", BrandSchema);
