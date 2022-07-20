const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const schemaOpt = { virtuals: true };
const ListSchema = new Schema(
  {
    author_name: { type: String, required: true },
    build_name: { type: String, required: true },
    description: { type: String, required: true },
    thumbnail_url: { type: String },
    components: {
      type: Map,
      of: { type: Schema.Types.ObjectId, ref: "Product" },
    },
  },
  schemaOpt
);

/* 
  TODO: Create a "total_price" virtual and figure out how we can populate
  a referenced ObjectId within a virtual and then aggregate on that virtual
  (with the populated values)
    - Need sample data in order to do so
*/

/*
ProductSchema.virtual("populatedComponents", {
  ref: "Product",
  localField: "components",
  foreignField: "_id",
});

ProductSchema.virtual("total_price").get(function () {
  const components = this.populatedComponents;
});
*/

// Export Model
module.exports = mongoose.model("List", ListSchema);
