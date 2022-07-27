const hashHelper = require("../helpers/hashHelper");
const Category = require("../models/category");
const Product = require("../models/product");
const List = require("../models/list");

/* Fetch the build we have stored in cookies */
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
  // Wait until all promises have finished (regardless of resolve or reject)
  const prodsInfo = await Promise.allSettled(
    prevItems.map((prodId) =>
      Product.findById(prodId, "category name short_name price image_url")
        .populate("category")
        .catch((e) => {
          console.log(e);
          return e;
        })
    )
  );
  // Keep the products w/ successful promise & returned a value (handles
  // error case for we add a nonexistent product and prevents MongoDB
  // invalid ObjectID Ref error)
  const validResults = prodsInfo
    .filter((result) => result.status === "fulfilled" && !!result.value)
    .map((prod) => prod.value);
  // Get final return object by mapping over each product & extracting necessary info
  let selectedProducts = {};
  validResults.forEach((prod) => {
    selectedProducts[prod.category.name] = {
      _id: prod._id,
      short_name: prod.short_name,
      price: prod.price,
      image_url: prod.image_url,
      buy_link: prod.buy_link,
      url_route: prod.url_route,
    };
  });

  return { ctgies: categories, selProds: selectedProducts };
};

/* Add a "price" (totalPrice) field to a Mongoose "List" schema object */
exports.addBuildPriceField = (buildInfo) => {
  let price = 0;
  buildInfo.components.forEach((val) => (price += val.price));
  // Round total price to 2 decimal places
  buildInfo.price = `$${price.toFixed(2)}`;

  return buildInfo;
};

/* Remove the cookies related to the build when creating or updating */
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

/* Simple function to help validate a build's save password the user inputted */
exports.validateBuildSavePassword = async (buildId, savePassword) => {
  const existingBuild = await List.findById(buildId, "hashedSavePass");
  const isValid = await hashHelper.verifyPassword(
    savePassword,
    existingBuild.hashedSavePass
  );

  return isValid;
};

/*
  Gets the components in a Mongoose "List" schema object and save them
  into cookies
*/
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

/*
  Clean up the cookies in our browser for after we successfully or
  cancel an update to a build list
*/
exports.cleanUpSaveBuildCookies = (req, res, buildId) => {
  res.clearCookie("currList");
  res.clearCookie(`${buildId}-saved-pass`);
  this.clearBuildCookies(req, res, "saved");
};
