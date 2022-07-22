const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const CategorySchema = new Schema({
  name: { type: String, required: true },
  previewImg: { type: String, required: true },
  description: { type: String, required: true },
});

// Export Model
module.exports = mongoose.model("Category", CategorySchema);
