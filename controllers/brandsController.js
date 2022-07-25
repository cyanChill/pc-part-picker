const { body, validationResult } = require("express-validator");

const Brand = require("../models/brand");
const Product = require("../models/product.js");

exports.brandsGet = async (req, res, next) => {
  const brands = await Brand.find({}).sort({ name: 1 });

  res.render("brands/brands", {
    title: "Manufacturers",
    brands: brands,
  });
};

exports.brandCreateGet = async (req, res, next) => {
  res.render("brands/brand_form", {
    title: "Add a Manufacturer",
  });
};

exports.brandCreatePost = [
  body("name", "Manufacturer Name must be >1 but <=30 characters long.")
    .trim()
    .isLength({ min: 1, max: 30 })
    .escape(),

  async (req, res, next) => {
    const errors = validationResult(req);

    const newBrandTemp = { name: req.body.name };

    if (!errors.isEmpty()) {
      return res.render("brands/brand_form", {
        title: "Add a New Manufacturer",
        prevVal: newBrandTemp,
        errs: errors.errors,
      });
    }

    // Success
    try {
      const newBrand = await Brand.create(newBrandTemp);
      // Goto new brand page
      res.redirect(newBrand.url_route);
    } catch (err) {
      return next(err);
    }
  },
];

exports.brandDetailGet = async (req, res, next) => {
  const { brandId } = req.params;
  const currBrand = req.body.brandData;
  const brandProducts = await Product.find({ brand: brandId })
    .populate("category")
    .sort({ name: 1, "category.name": 1 });

  res.render("brands/brand_detail", {
    title: `${currBrand.name}'s Products`,
    currBrand: currBrand,
    products: brandProducts,
  });
};

exports.brandDeleteGet = async (req, res, next) => {
  const brandProducts = await Product.find({ brand: req.params.brandId }).sort({
    short_name: 1,
  });

  res.render("delete_group", {
    title: "Delete Manufacturer",
    groupType: "Manufacturer",
    groupProducts: brandProducts,
    currGroup: req.body.brandData,
  });
};

exports.brandDeletePost = async (req, res, next) => {
  const brandProducts = await Product.find({ brand: req.params.brandId }).sort({
    short_name: 1,
  });

  // If we still have products or admin password is incorrect
  if (
    brandProducts.length > 0 ||
    req.body.pass !== process.env.ADMIN_PASSWORD
  ) {
    return res.render("delete_group", {
      title: "Delete Manufacturer",
      groupType: "Manufacturer",
      groupProducts: brandProducts,
      currGroup: req.body.brandData,
      error: true,
    });
  }

  // No products left in brand
  try {
    await Brand.findByIdAndDelete(req.params.brandId);
    res.redirect("/");
  } catch (err) {
    return next(err);
  }
};
