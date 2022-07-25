const { validationResult } = require("express-validator");

const cstmMiddleware = require("../helpers/customMiddleware");
const productHelper = require("../helpers/productHelper");

const Brand = require("../models/brand");
const Category = require("../models/category");
const List = require("../models/list");
const Product = require("../models/product");

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

exports.productCreatePost = [
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

    // Success
    try {
      const newProduct = await Product.create(newProdTemp);
      // Goto new product page
      res.redirect(newProduct.url_route);
    } catch (err) {
      return next(err);
    }
  },
];

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
    const isUpdatedSavedBuild = req.cookies.currList;
    await productHelper.addProdToList(
      res,
      prodId,
      ctgyId,
      isUpdatedSavedBuild ? "saved" : "curr"
    );

    res.redirect("/builds/create");
  } catch (err) {
    next(err);
  }
};

exports.productUpdateGet = async (req, res, next) => {
  const [brands, categories] = await Promise.all([
    Brand.find({}, "name").sort({ name: 1 }),
    Category.find({}, "name").sort({ name: 1 }),
  ]);

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
        // Successful - redirect to product detail page
        res.redirect(updatedProd.url_route);
      }
    );
  },
];

exports.productDeleteGet = async (req, res, next) => {
  const productCtgy = req.body.productData.category.name;
  const listsWProduct = await List.find({
    [`components.${productCtgy}`]: req.params.productId,
  }).sort({ build_name: 1 });

  const items = listsWProduct.map((item) => ({
    ...item._doc,
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

exports.productDeletePost = async (req, res, next) => {
  const productCtgy = req.body.productData.category.name;
  const listsWProduct = await List.find({
    [`components.${productCtgy}`]: req.params.productId,
  }).sort({ build_name: 1 });

  const items = listsWProduct.map((item) => ({
    ...item._doc,
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

  // No products left in product
  try {
    await Product.findByIdAndDelete(req.params.productId);
    res.redirect("/");
  } catch (err) {
    return next(err);
  }
};
