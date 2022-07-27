const { body, validationResult } = require("express-validator");

const Brand = require("../models/brand");
const Product = require("../models/product.js");

/* Function to handle getting a list of all brands. */
exports.brandsGet = async (req, res, next) => {
  const brands = await Brand.find({}).sort({ name: 1 });
  res.render("brands/brands", {
    title: "Manufacturers",
    brands: brands,
  });
};

/* Function to render the form for creating a brand. */
exports.brandCreateGet = async (req, res, next) => {
  res.render("brands/brand_form", {
    title: "Add a Manufacturer",
  });
};

/* Function to handle the form submission of creating a brand. */
exports.brandCreatePost = [
  body("name", "Manufacturer Name must be >1 but <=30 characters long.")
    .trim()
    .isLength({ min: 1, max: 30 })
    .escape(),

  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render("brands/brand_form", {
        title: "Add a New Manufacturer",
        prevVal: { name: req.body.name },
        errs: errors.errors,
      });
    }

    try {
      // Success!
      const newBrand = await Brand.create({ name: req.body.name });
      res.redirect(newBrand.url_route); // Goto new brand page
    } catch (err) {
      return next(err);
    }
  },
];

/*  Function to render the page with all the brand's products. */
exports.brandDetailGet = async (req, res, next) => {
  const unsortedBrandProducts = await Product.find({
    brand: req.params.brandId,
  }).populate("category");
  // Sort brand products by category name then product name
  const brandProducts = unsortedBrandProducts.sort((a, b) => {
    if (a.category.name === b.category.name) {
      // Product name is important if categories are the same
      return a.name > b.name ? 1 : -1;
    }
    return a.category.name > b.category.name ? 1 : -1;
  });

  res.render("brands/brand_detail", {
    title: `${req.body.brandData.name}'s Products`,
    currBrand: req.body.brandData,
    products: brandProducts,
  });
};

/*
  Function to render the form for deleting a brand.
    ⭐ SHOULD NOT DELETE A BRAND IF IT STILL HAS PRODUCTS ASSOCIATE WITH IT.
*/
exports.brandDeleteGet = async (req, res, next) => {
  // Get all the products for the brand
  const brandProducts = await Product.find(
    { brand: req.params.brandId },
    "short_name"
  ).sort({ short_name: 1 });

  res.render("delete_group", {
    title: "Delete Manufacturer",
    groupType: "Manufacturer",
    groupProducts: brandProducts,
    currGroup: req.body.brandData,
  });
};

/*
  Function to handle the form submission of deleting a brand.
    ⭐ SHOULD NOT DELETE A BRAND IF IT STILL HAS PRODUCTS ASSOCIATE WITH IT.
*/
exports.brandDeletePost = async (req, res, next) => {
  const brandProducts = await Product.find(
    { brand: req.params.brandId },
    "short_name"
  ).sort({ short_name: 1 });

  // If the brand still have products or admin password is incorrect
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

  try {
    // Success! No products left in brand
    await Brand.findByIdAndDelete(req.params.brandId);
    res.redirect("/");
  } catch (err) {
    return next(err);
  }
};
