const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const schemaOpt = { toJSON: { virtuals: true } };

const ListSchema = new Schema(
  {
    author_name: { type: String, required: true, maxLength: 30 },
    build_name: { type: String, required: true, maxLength: 30 },
    description: { type: String, required: true, maxLength: 200 },
    thumbnail_url: { type: String, required: true },
    components: {
      type: Map,
      of: { type: Schema.Types.ObjectId, ref: "Product" },
    },
    hashedSavePass: {
      type: String,
      minLength: 6,
      required: true,
      select: false,
    },
  },
  schemaOpt
);

ListSchema.virtual("url_route").get(function () {
  return `/builds/${this._id}`;
});

module.exports = mongoose.model("List", ListSchema);
