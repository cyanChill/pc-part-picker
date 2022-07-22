const Category = require("../models/category");
const Product = require("../models/product");

exports.getBuildInfo = async (req, listType) => {
  if (!req) throw new Error("Did not provide Request object.");
  if (!listType) throw new Error("Did not provide list type/name.");

  // Get Category Names
  const categories = await Category.find({}).sort({ name: 1 });
  const categoryIds = categories.map((cat) => `${cat._id}-${listType}`);

  // Get the ids of the products we've saved in the cookies
  const browserCookies = req.cookies ? req.cookies : {};
  const prevItems = [];
  for (let keyId in browserCookies) {
    if (categoryIds.includes(keyId)) {
      prevItems.push(browserCookies[keyId]);
    }
  }

  // Fetch product info
  const prodsInfo = await Promise.all(
    prevItems.map((prodId) =>
      Product.findById(
        prodId,
        "category name short_name price image_url"
      ).populate("category")
    )
  );

  // Get final return object by mapping over each product & extracting necessary info
  let selectedProducts = {};
  prodsInfo.forEach((prod) => {
    selectedProducts[prod.category.name] = {
      _id: prod._id,
      short_name: prod.short_name,
      price: prod.price,
      image_url: prod.image_url,
      buy_link: prod.buy_link,
    };
  });

  return { categories: categories, selectedProducts: selectedProducts };
};

exports.addBuildPriceField = (buildInfo) => {
  let price = 0;
  buildInfo.components.forEach((val, key) => (price += val.price));
  buildInfo.price = `$${price}`;

  return buildInfo;
};
