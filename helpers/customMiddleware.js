const { body } = require("express-validator");

const buildsHelper = require("../helpers/buildsHelper");

const Brand = require("../models/brand");
const Category = require("../models/category");
const List = require("../models/list");
const Product = require("../models/product");

/* Custom validator */
const cstmFeatureCheck = (val, maxLength) => {
  if (Array.isArray(val)) {
    // Value is an array
    return val.every(
      (entry) => entry.trim().length !== 0 && entry.trim().length <= maxLength
    );
  } else {
    // Value is a string
    if (val.trim().length === 0 || val.trim().length > maxLength) return false;
    return true;
  }
};

/* Custom Middleware */
exports.validateBrandId = async (req, res, next) => {
  try {
    const brandExists = await Brand.findById(req.params.brandId);
    if (!brandExists) throw new Error("Brand does not exist.");
    req.body.brandData = brandExists;
    return next();
  } catch (err) {
    return next(err);
  }
};

exports.validateBuildId = async (req, res, next) => {
  try {
    const buildExists = await List.findById(req.params.buildId).populate(
      "components.$*"
    );
    if (!buildExists) throw new Error("Build does not exist.");
    req.body.buildData = buildExists;
    return next();
  } catch (err) {
    return next(err);
  }
};

exports.validateCategoryId = async (req, res, next) => {
  try {
    const categoryExists = await Category.findById(req.params.categoryId);
    if (!categoryExists) throw new Error("Category does not exist.");
    req.body.categoryData = categoryExists;
    return next();
  } catch (err) {
    return next(err);
  }
};

exports.validateProductId = async (req, res, next) => {
  try {
    const productExists = await Product.findById(req.params.productId)
      .populate("category")
      .populate("brand");
    if (!productExists) throw new Error("Product does not exist.");
    req.body.productData = productExists;
    return next();
  } catch (err) {
    return next(err);
  }
};

exports.validateBuildSavePass = async (req, res, next) => {
  const { buildId } = req.params;
  // Check for save cookie if we previously wrote the save password for the build
  const prevSavePass = req.cookies[`${buildId}-saved-pass`] || "";
  // Check to see if save password is valid
  const isValid = await buildsHelper.validateBuildSavePassword(
    buildId,
    prevSavePass
  );

  if (!isValid && prevSavePass !== process.env.ADMIN_PASSWORD) {
    // Remove currList cookie if invalid password
    res.clearCookie(`${req.cookies.currList}-saved-pass`);
    res.clearCookie("currList");
    // Redirect to pass_validation route to obtain save password
    res.render("pass_validation", {
      title: "Build Save Password",
      passType: "Build Save",
      submitURL: `/builds/${buildId}/validateSavePass`,
    });
    return;
  }

  // Otherwise, refresh cookies (for 1h)
  res.cookie(`currList`, buildId, { maxAge: 3600000, httpOnly: true });
  res.cookie(`${buildId}-saved-pass`, prevSavePass, {
    maxAge: 3600000,
    httpOnly: true,
  });
  next();
};

exports.validateBuildListInputs = [
  body("author_name")
    .trim()
    .isLength({ min: 1, max: 30 })
    .escape()
    .withMessage("Author Name must be >1 but <=30 characters long.")
    .isAlphanumeric()
    .withMessage("Author Name has non-alphanumeric characters."),
  body("build_name")
    .trim()
    .isLength({ min: 1, max: 30 })
    .escape()
    .withMessage("Build Name must be >1 but <=30 characters long.")
    .isAlphanumeric()
    .withMessage("Build Name has non-alphanumeric characters."),
  body("description", "Description must be >1 but <=200 characters long.")
    .trim()
    .isLength({ min: 1, max: 200 })
    .escape(),
  body("thumbnail_url", "Thumbnail URL must be a valid URL.").trim().isURL(),
];

exports.validateCategoryInputs = [
  body("name")
    .trim()
    .isLength({ min: 1, max: 30 })
    .escape()
    .withMessage("Category Name must be >1 but <=30 characters long.")
    .isAlphanumeric()
    .withMessage("Category Name has non-alphanumeric characters."),
  body("description", "Description must be >1 but <=200 characters long.")
    .trim()
    .isLength({ min: 1, max: 200 })
    .escape(),
  body("img").trim(),
];

exports.validateProductInputs = [
  body("name", "Product Name must be >1 but <=100 characters long.")
    .trim()
    .isLength({ min: 1, max: 100 })
    .escape(),
  body("short_name", "Product Short Name must be >1 but <=50 characters long.")
    .trim()
    .isLength({ min: 1, max: 50 })
    .escape(),

  body("category", "The Category selected was invalid").custom((val) => {
    return Category.findById(val)
      .then((result) => {
        if (!result) return Promise.reject();
      })
      .catch((err) => Promise.reject());
  }),
  body("brand", "The Brand selected was invalid").custom((val) => {
    return Brand.findById(val)
      .then((result) => {
        if (!result) return Promise.reject();
      })
      .catch((err) => Promise.reject());
  }),

  body("price", "Price must be >=$0 but <=$99999.99.").isFloat({
    min: 0,
    max: 99999.99,
  }),
  body("stock", "Stock must be an integer >=0 but <=999999999.").isInt({
    min: 0,
    max: 999999999,
  }),
  body("img", "Product Image must be a valid URL.").trim().isURL(),
  // W/ Custom Validator Functions
  body("feat_name", "Feature Name must be >1 but <=50 characters long.")
    .optional({ checkFalsy: true })
    .custom((val) => cstmFeatureCheck(val, 50)),
  body("feat_des", "Feature Description must be >1 but <=30 characters long.")
    .optional({ checkFalsy: true })
    .custom((val) => cstmFeatureCheck(val, 30)),
];
