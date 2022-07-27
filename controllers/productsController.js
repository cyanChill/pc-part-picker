const { validationResult } = require("express-validator");

const cstmMiddleware = require("../helpers/customMiddleware");
const productHelper = require("../helpers/productHelper");

const Brand = require("../models/brand");
const Category = require("../models/category");
const List = require("../models/list");
const Product = require("../models/product");

/* Function to render the form for creating a product. */
exports.productCreateGet = async (req, res, next) => {
  const [brands, categories] = await Promise.all([
    Brand.find({}, "name").sort({ name: 1 }),
    Category.find({}, "name").sort({ name: 1 }),
  ]);
  res.render("products/product_form", {
    title: "Add a New Product",
    brands: brands,
    categories: categories,
    prevVal: { category: req.query.ctgyId },
  });
};

/* Function to handle the form submission of creating a product. */
exports.productCreatePost = [
  ...cstmMiddleware.validateProductInputs,

  async (req, res, next) => {
    const errors = validationResult(req);
    const [brands, categories] = await Promise.all([
      Brand.find({}, "name").sort({ name: 1 }),
      Category.find({}, "name").sort({ name: 1 }),
    ]);
    // Convert the feature name & description input fields into an array
    // of objects
    const prodFeatures = [];
    if (req.body.feat_name) {
      if (Array.isArray(req.body.feat_name)) {
        // If 2+ input field, data is returned as array
        req.body.feat_name.forEach((_, idx) => {
          prodFeatures.push({
            feature: req.body.feat_name[idx],
            description: req.body.feat_des[idx],
          });
        });
      } else {
        // If only 1 input field, data is returned as string
        prodFeatures.push({
          feature: req.body.feat_name,
          description: req.body.feat_des,
        });
      }
    }

    const newProdTemp = {
      name: req.body.name,
      short_name: req.body.short_name,
      category: req.body.category,
      brand: req.body.brand,
      price: req.body.price,
      stock: req.body.stock,
      image_url: req.body.img,
      features: prodFeatures,
    };

    if (!errors.isEmpty()) {
      return res.render("products/product_form", {
        title: "Add a New Category",
        brands: brands,
        categories: categories,
        prevVal: newProdTemp,
        features: prodFeatures,
        errs: errors.errors,
      });
    }

    try {
      // Success!
      const newProduct = await Product.create(newProdTemp);
      res.redirect(newProduct.url_route); // Goto new product page
    } catch (err) {
      return next(err);
    }
  },
];

/* Function to render the page containing information on the product. */
exports.productDetailGet = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const result = await Product.findById(productId)
      .populate("category")
      .populate("brand");
    res.render("products/product_detail", {
      title: result.name,
      prodInfo: result,
    });
  } catch (err) {
    return next(err);
  }
};

/*
  Function to add a product to the current list (a new list or list we're
  currently updating.
*/
exports.productAddListPost = async (req, res, next) => {
  try {
    await productHelper.addProdToList(
      res,
      req.params.productId,
      req.body.productData.category._id,
      req.cookies.currList ? "saved" : "curr"
    );
    res.redirect("/builds/create");
  } catch (err) {
    next(err);
  }
};

/* Function to render the form for updating a product. */
exports.productUpdateGet = async (req, res, next) => {
  const [brands, categories] = await Promise.all([
    Brand.find({}, "name").sort({ name: 1 }),
    Category.find({}, "name").sort({ name: 1 }),
  ]);
  // Stringifying the _id fields for easier comparison in HTML template
  const productData = {
    ...req.body.productData._doc,
    category: req.body.productData.category._id.toString(),
    brand: req.body.productData.brand._id.toString(),
  };

  res.render("products/product_form", {
    title: "Update Product",
    brands: brands,
    categories: categories,
    prevVal: productData,
    features: req.body.productData.features,
    isUpdating: true,
  });
};

/* Function to handle the form submission of updating a product. */
exports.productUpdatePost = [
  ...cstmMiddleware.validateProductInputs,

  async (req, res, next) => {
    const errors = validationResult(req);
    const [brands, categories] = await Promise.all([
      Brand.find({}, "name").sort({ name: 1 }),
      Category.find({}, "name").sort({ name: 1 }),
    ]);

    const prodFeatures = [];
    if (req.body.feat_name) {
      if (Array.isArray(req.body.feat_name)) {
        req.body.feat_name.forEach((_, idx) => {
          prodFeatures.push({
            feature: req.body.feat_name[idx],
            description: req.body.feat_des[idx],
          });
        });
      } else {
        prodFeatures.push({
          feature: req.body.feat_name,
          description: req.body.feat_des,
        });
      }
    }

    const updatedContents = {
      name: req.body.name,
      short_name: req.body.short_name,
      category: req.body.category,
      brand: req.body.brand,
      price: req.body.price,
      stock: req.body.stock,
      image_url: req.body.img,
      features: prodFeatures,
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
      return res.render("products/product_form", {
        title: "Add a New Category",
        brands: brands,
        categories: categories,
        prevVal: updatedContents,
        features: prodFeatures,
        errs: errors.errors,
        isUpdating: true,
      });
    }

    // Success
    Product.findByIdAndUpdate(
      req.params.productId,
      updatedContents,
      function (err, updatedProd) {
        if (err) return next(err);
        res.redirect(updatedProd.url_route); // Goto product detail page
      }
    );
  },
];

/*
  Function to render the form for deleting a product.
    ⭐ SHOULD NOT DELETE A PRODUCT IF IT ASSOCIATE WITH A BUILD LIST.
*/
exports.productDeleteGet = async (req, res, next) => {
  const productCtgy = req.body.productData.category.name;
  const listsWProduct = await List.find(
    { [`components.${productCtgy}`]: req.params.productId },
    "build_name"
  ).sort({ build_name: 1 });
  // Reformatting data for use with delete_group template
  const items = listsWProduct.map((item) => ({
    short_name: item.build_name,
    url_route: item.url_route,
  }));

  res.render("delete_group", {
    title: "Delete Product",
    groupType: "Product",
    groupProducts: items,
    currGroup: req.body.productData,
  });
};

/*
  Function to handle the form submission of deleting a category.
    ⭐ SHOULD NOT DELETE A PRODUCT IF IT ASSOCIATE WITH A BUILD LIST.
*/
exports.productDeletePost = async (req, res, next) => {
  const productCtgy = req.body.productData.category.name;
  const listsWProduct = await List.find(
    { [`components.${productCtgy}`]: req.params.productId },
    "build_name"
  ).sort({ build_name: 1 });

  const items = listsWProduct.map((item) => ({
    short_name: item.build_name,
    url_route: item.url_route,
  }));

  // If we still have products or admin password is incorrect
  if (items.length > 0 || req.body.pass !== process.env.ADMIN_PASSWORD) {
    return res.render("delete_group", {
      title: "Delete Product",
      groupType: "Product",
      groupProducts: items,
      currGroup: req.body.productData,
      error: true,
    });
  }

  try {
    // Success! No lists with product
    await Product.findByIdAndDelete(req.params.productId);
    res.redirect("/");
  } catch (err) {
    return next(err);
  }
};
