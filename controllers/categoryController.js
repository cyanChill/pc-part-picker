const { validationResult } = require("express-validator");

const cstmMiddleware = require("../helpers/customMiddleware");

const Category = require("../models/category");
const Product = require("../models/product");

exports.categoryGet = async (req, res, next) => {
  // Get all categories
  const results = await Category.find({}).sort({ name: 1 });
  res.render("category/categories", {
    title: "Product Categories",
    categories: results,
  });
};

exports.categoryCreateGet = async (req, res, next) => {
  res.render("category/category_form", {
    title: "Add a New Category",
  });
};

exports.categoryCreatePost = [
  ...cstmMiddleware.validateCategoryInputs,

  async (req, res, next) => {
    const errors = validationResult(req);

    const newCtgyTemp = {
      name: req.body.name,
      previewImg: req.body.img,
      description: req.body.description,
    };

    if (req.body.pass !== process.env.ADMIN_PASSWORD) {
      errors.errors.push({
        value: req.body.pass,
        msg: "Admin password is incorrect",
        param: "pass",
        location: "body",
      });
    }

    if (!errors.isEmpty()) {
      return res.render("category/category_form", {
        title: "Add a New Category",
        prevVal: newCtgyTemp,
        pass: req.body.pass,
        errs: errors.errors,
      });
    }

    // Success
    try {
      const newCategory = await Category.create(newCtgyTemp);
      // Goto new category page
      res.redirect(newCategory.url_route);
    } catch (err) {
      return next(err);
    }
  },
];

exports.categoryDetailGet = async (req, res, next) => {
  try {
    const { categoryId } = req.params;
    const ctgyInfo = req.body.categoryData;
    // Get Category Products
    const ctgyProducts = await Product.find({ category: categoryId })
      .sort({ name: 1 })
      .populate("brand")
      .populate("category");

    res.render("category/category_detail", {
      title: `${ctgyInfo.name} Products`,
      category: ctgyInfo,
      products: ctgyProducts,
    });
  } catch (err) {
    return next(err);
  }
};

exports.categoryUpdateGet = async (req, res, next) => {
  res.render("category/category_form", {
    title: "Update Category",
    prevVal: req.body.categoryData,
  });
};

exports.categoryUpdatePost = [
  ...cstmMiddleware.validateCategoryInputs,

  async (req, res, next) => {
    const errors = validationResult(req);
    const updatedContents = {
      name: req.body.name,
      previewImg: req.body.img,
      description: req.body.description,
    };

    if (req.body.pass !== process.env.ADMIN_PASSWORD) {
      errors.errors.push({
        value: req.body.pass,
        msg: "Admin password is incorrect",
        param: "pass",
        location: "body",
      });
    }

    if (!errors.isEmpty()) {
      return res.render("category/category_form", {
        title: "Update Category",
        prevVal: updatedContents,
        pass: req.body.pass,
        errs: errors.errors,
      });
    }

    // Success
    Category.findByIdAndUpdate(
      req.params.categoryId,
      updatedContents,
      function (err, updatedCtgy) {
        if (err) return next(err);
        // Successful - redirect to category detail page
        res.redirect(updatedCtgy.url_route);
      }
    );
  },
];

exports.categoryDeleteGet = async (req, res, next) => {
  const ctgyProducts = await Product.find({
    category: req.params.categoryId,
  }).sort({ short_name: 1 });

  res.render("delete_group", {
    title: "Delete Category",
    groupType: "Category",
    groupProducts: ctgyProducts,
    currGroup: req.body.categoryData,
  });
};

exports.categoryDeletePost = async (req, res, next) => {
  const ctgyProducts = await Product.find({
    category: req.params.categoryId,
  }).sort({ short_name: 1 });

  // If we still have products or admin password is incorrect
  if (ctgyProducts.length > 0 || req.body.pass !== process.env.ADMIN_PASSWORD) {
    return res.render("delete_group", {
      title: "Delete Category",
      groupType: "Category",
      groupProducts: ctgyProducts,
      currGroup: req.body.categoryData,
      error: true,
    });
  }

  // No products left in category
  try {
    await Category.findByIdAndDelete(categoryId);
    res.redirect("/");
  } catch (err) {
    return next(err);
  }
};
