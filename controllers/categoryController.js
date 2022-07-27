const { validationResult } = require("express-validator");

const cstmMiddleware = require("../helpers/customMiddleware");

const Category = require("../models/category");
const Product = require("../models/product");

/* Function to handle getting a list of all categories. */
exports.categoryGet = async (req, res, next) => {
  const results = await Category.find({}).sort({ name: 1 });
  res.render("category/categories", {
    title: "Product Categories",
    categories: results,
  });
};

/* Function to render the form for creating a category. */
exports.categoryCreateGet = async (req, res, next) => {
  res.render("category/category_form", {
    title: "Add a New Category",
  });
};

/* Function to handle the form submission of creating a category. */
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

    try {
      // Success!
      const newCategory = await Category.create(newCtgyTemp);
      res.redirect(newCategory.url_route); // Goto new category page
    } catch (err) {
      return next(err);
    }
  },
];

/*  Function to render the page containing all the products in the category. */
exports.categoryDetailGet = async (req, res, next) => {
  try {
    // Get Category Products
    const ctgyProducts = await Product.find({ category: req.params.categoryId })
      .sort({ name: 1 })
      .populate("brand")
      .populate("category");
    res.render("category/category_detail", {
      title: `${req.body.categoryData.name} Products`,
      category: req.body.categoryData,
      products: ctgyProducts,
    });
  } catch (err) {
    return next(err);
  }
};

/* Function to render the form for updating a category. */
exports.categoryUpdateGet = async (req, res, next) => {
  res.render("category/category_form", {
    title: "Update Category",
    prevVal: req.body.categoryData,
  });
};

/* Function to handle the form submission of updating a category. */
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
        res.redirect(updatedCtgy.url_route); // Goto category detail page
      }
    );
  },
];

/*
  Function to render the form for deleting a category.
    ⭐ SHOULD NOT DELETE A CATEGORY IF IT STILL HAS PRODUCTS ASSOCIATE WITH IT.
*/
exports.categoryDeleteGet = async (req, res, next) => {
  const ctgyProducts = await Product.find(
    { category: req.params.categoryId },
    "short_name"
  ).sort({ short_name: 1 });

  res.render("delete_group", {
    title: "Delete Category",
    groupType: "Category",
    groupProducts: ctgyProducts,
    currGroup: req.body.categoryData,
  });
};

/*
  Function to handle the form submission of deleting a category.
    ⭐ SHOULD NOT DELETE A CATEGORY IF IT STILL HAS PRODUCTS ASSOCIATE WITH IT.
*/
exports.categoryDeletePost = async (req, res, next) => {
  const ctgyProducts = await Product.find(
    { category: req.params.categoryId },
    "short_name"
  ).sort({ short_name: 1 });

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

  try {
    // Success! No products left in category
    await Category.findByIdAndDelete(req.params.categoryId);
    res.redirect("/");
  } catch (err) {
    return next(err);
  }
};
