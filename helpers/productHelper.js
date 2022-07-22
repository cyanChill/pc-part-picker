const Category = require("../models/category");
const Product = require("../models/product");

exports.addProdToList = async (res, prodId, ctgyId, listType) => {
  if (!res) throw new Error("Did not provide Response object.");
  if (!prodId) throw new Error("Did not provide Product Id.");
  if (!ctgyId) throw new Error("Did not provide Category Id.");
  if (!listType) throw new Error("Did not provide list type/name.");

  res.cookie(`${ctgyId}-${listType}`, prodId, {
    maxAge: 259200000, // Saves for 3 days (in milliseconds)
    httpOnly: true,
  });
};

exports.removeItemFromList = async (res, ctgyId, listType) => {
  if (!res) throw new Error("Did not provide Response object.");
  if (!ctgyId) throw new Error("Did not provide Category Id.");
  if (!listType) throw new Error("Did not provide list type/name.");

  // Delete a cookie
  res.clearCookie(`${ctgyId}-${listType}`);
};
