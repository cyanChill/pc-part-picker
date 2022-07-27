const Category = require("../models/category");
const Product = require("../models/product");

/* Adds a product to brower cookies for current build list */
exports.addProdToList = async (res, prodId, ctgyId, listType) => {
  if (!res) throw new Error("Did not provide Response object.");
  if (!prodId) throw new Error("Did not provide Product Id.");
  if (!ctgyId) throw new Error("Did not provide Category Id.");
  if (!listType) throw new Error("Did not provide list type/name.");

  // Validate the category & product ids are valid
  const [ctgy, prod] = await Promise.all([
    Category.findById(ctgyId),
    Product.findById(prodId),
  ]);
  if (!ctgy || !prod) throw new Error("Category or Product Id is invalid");

  res.cookie(`${ctgyId}-${listType}`, prodId, {
    maxAge: 259200000, // Saves for 3 days (in milliseconds)
    httpOnly: true,
  });
};

/* Removes a product cookie for current buildl list*/
exports.removeItemFromList = async (res, ctgyId, listType) => {
  if (!res) throw new Error("Did not provide Response object.");
  if (!ctgyId) throw new Error("Did not provide Category Id.");
  if (!listType) throw new Error("Did not provide list type/name.");

  // Delete a cookie
  res.clearCookie(`${ctgyId}-${listType}`);
};
