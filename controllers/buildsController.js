const buildsHelper = require("../helpers/buildsHelper");
const productHelper = require("../helpers/productHelper");
const Category = require("../models/category");
const List = require("../models/list");

exports.buildGet = async (req, res, next) => {
  try {
    /* TESTING PURPOSES */
    productHelper.addProdToList(
      res,
      "62d86f6a70ae17716c474e24", // Product Id
      "62d86f6970ae17716c474dd3", // Category Id
      "curr"
    );

    res.render("builds/builds", {
      title: "Completed Builds",
    });
  } catch (err) {
    next(err);
  }
};

exports.buildCreateGet = async (req, res, next) => {
  try {
    const results = await buildsHelper.getBuildInfo(req, "curr");

    res.render("builds/build_form", {
      title: "PC Builder",
      categories: results.categories,
      currList: results.selectedProducts,
    });
  } catch (err) {
    return next(err);
  }
};

exports.buildComponentDelete = async (req, res, next) => {
  try {
    const { ctgyId } = req.body;
    await productHelper.removeItemFromList(res, ctgyId, "curr");

    res.redirect("/builds/create");
  } catch (err) {
    return next(err);
  }
};

exports.buildCreatePost = async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Create Builds POST Route");
};

exports.buildDetailGet = async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Builds Detail Page");
};
