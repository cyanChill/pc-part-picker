const productHelper = require("../helpers/productHelper");
const Product = require("../models/product");

exports.productCreateGet = async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Product Create Page");
};

exports.productCreatePost = async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Create Product POST Route");
};

exports.productDetailGet = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const result = await Product.findById(productId)
      .populate("category")
      .populate("brand");

    if (!result) {
      // TODO: Handle by throwing different error page
      throw new Error("No Product Found");
    }
    console.log(result);

    res.render("products/product_detail", {
      title: result.name,
      prodInfo: result,
    });
  } catch (err) {
    return next(err);
  }
};

exports.productAddListPost = async (req, res, next) => {
  try {
    const { prodId, ctgyId } = req.body;
    await productHelper.addProdToList(res, prodId, ctgyId, "curr");
    await productHelper.addProdToList(res, prodId, ctgyId, "saved");

    res.redirect("/builds/create");
  } catch (err) {
    next(err);
  }
};
