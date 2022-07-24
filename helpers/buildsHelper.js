const hashHelper = require("../helpers/hashHelper");
const Category = require("../models/category");
const Product = require("../models/product");
const List = require("../models/list");

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
    if (categoryIds.includes(keyId)) prevItems.push(browserCookies[keyId]);
  }
  // Fetch product info (we handle the error externally)
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

exports.clearBuildCookies = (req, res, listType) => {
  const browserCookies = req.cookies ? req.cookies : {};
  const regex = new RegExp(`.*\-${listType}`);
  // Get list of cookies for listType
  const cookieNames = [];
  for (let keyId in browserCookies) {
    if (regex.test(keyId)) cookieNames.push(keyId);
  }
  // Delete each of the cookies
  cookieNames.forEach((ckie) => res.clearCookie(ckie));
};

exports.validateBuildSavePassword = async (buildId, savePassword) => {
  const existingBuild = await List.findById(buildId, "hashedSavePass");
  const isValid = await hashHelper.verifyPassword(
    savePassword,
    existingBuild.hashedSavePass
  );

  return isValid;
};

exports.addSavedBuildInfoToCookies = async (res, buildId) => {
  const [ctgy, buildList] = await Promise.all([
    Category.find({}).sort({ name: 1 }),
    List.findById(buildId, "components").populate("components.$*"),
  ]);
  const comps = Object.fromEntries(buildList.components);
  ctgy.forEach((cat) => {
    // Clear previous cookie
    res.clearCookie(`${cat._id}-saved`);
    // Only create the cookie if the component value exists
    const compVal = comps[cat.name];
    if (compVal) res.cookie(`${cat._id}-saved`, compVal);
  });
};

exports.cleanUpSaveBuildCookies = (req, res, buildId) => {
  res.clearCookie("currList");
  res.clearCookie(`${buildId}-saved-pass`);
  this.clearBuildCookies(req, res, "saved");
};
