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
  res.send("NOT IMPLEMENTED: Category Create Page");
};

exports.categoryCreatePost = async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Create Category POST Route");
};

exports.categoryDetailGet = async (req, res, next) => {
  try {
    const { categoryId } = req.params;
    // Get Category Name + Products
    const [ctgyInfo, ctgyProducts] = await Promise.all([
      Category.findById(categoryId),
      Product.find({ category: categoryId })
        .sort({ name: 1 })
        .populate("brand"),
    ]);

    if (!ctgyInfo) {
      // TODO: Handle by throwing different error page
      return next(new Error("Category Not Found"));
    }
    console.log(ctgyProducts);

    res.render("category/category_detail", {
      title: `${ctgyInfo.name} Products`,
      categoryId: categoryId,
      products: ctgyProducts,
    });
  } catch (err) {
    return next(new Error(err));
  }
};
