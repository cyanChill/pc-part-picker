const buildsHelper = require("../helpers/buildsHelper");
const Category = require("../models/category");
const List = require("../models/list");

exports.buildGet = async (req, res, next) => {
  /* TESTING PURPOSES */
  res.cookie(
    `${"62d86f6970ae17716c474dd3"}-curr`,
    "62d86f6a70ae17716c474e24", // Product Id
    { maxAge: 900000, httpOnly: true }
  );

  res.render("builds", {
    title: "Completed Builds",
  });
};

exports.buildCreateGet = async (req, res, next) => {
  try {
    const { categories, selectedProducts } =
      await buildsHelper.getCurrBuildInfo(req);

    res.render("build_form", {
      title: "PC Builder",
      categories: categories,
      currList: selectedProducts,
    });
  } catch (err) {
    return next(err);
  }
};

exports.buildComponentDelete = async (req, res, next) => {
  try {
    const { componentId } = req.body;
    await buildsHelper.deleteCompFromCurrBuild(res, componentId);

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
