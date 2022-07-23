const { body, validationResult } = require("express-validator");

const buildsHelper = require("../helpers/buildsHelper");
const productHelper = require("../helpers/productHelper");
const hashHelper = require("../helpers/hashHelper.js");
const Category = require("../models/category");
const List = require("../models/list");

exports.buildGet = async (req, res, next) => {
  const results = await List.find({}).populate("components.$*");
  const builds = results ? results : [];

  try {
    const informizedBuilds = builds.map((build) =>
      buildsHelper.addBuildPriceField(build)
    );

    res.render("builds/builds", {
      title: "Completed Builds",
      buildList: informizedBuilds,
    });
  } catch (err) {
    return next(err);
  }
};

exports.buildCreateGet = async (req, res, next) => {
  try {
    const results = await buildsHelper.getBuildInfo(req, "curr");

    res.render("builds/build_form", {
      title: "PC Builder",
      categories: results.categories,
      comp_list: results.selectedProducts,
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

exports.buildCreatePost = [
  body("author_name")
    .trim()
    .isLength({ min: 1, max: 30 })
    .escape()
    .withMessage("Author Name must be >1 but <=30 characters long."),
  body("build_name")
    .trim()
    .isLength({ min: 1, max: 30 })
    .escape()
    .withMessage("Build Name must be >1 but <=30 characters long."),
  body("description")
    .trim()
    .isLength({ min: 1, max: 200 })
    .escape()
    .withMessage("Description must be >1 but <=200 characters long."),
  body("thumbnail_url")
    .trim()
    .isURL()
    .withMessage("Thumbnail URL must be a valid URL."),
  body("save_pass").trim().isLength({ min: 6 }),

  async (req, res, next) => {
    const errors = validationResult(req);
    const { categories, selectedProducts } = await buildsHelper.getBuildInfo(
      req,
      "curr"
    );

    if (Object.keys(selectedProducts).length === 0) {
      errors.errors.push({
        value: "",
        msg: "Build must contain at least one component.",
        param: "component",
        location: "cookie",
      });
    }

    const currBuildMap = new Map();
    for (const compName in selectedProducts) {
      currBuildMap.set(compName, selectedProducts[compName]._id);
    }

    const hashedPass = await hashHelper.hashPassword(req.body.save_pass);

    const newList = new List({
      author_name: req.body.author_name,
      build_name: req.body.build_name,
      description: req.body.description,
      thumbnail_url: req.body.thumbnail_url,
      components: currBuildMap,
      hashedSavePass: hashedPass,
    });

    if (!errors.isEmpty()) {
      res.render("builds/build_form", {
        title: "PC Builder",
        categories: categories,
        comp_list: selectedProducts,
        prevData: newList,
        prevPass: req.body.save_pass,
        formError: true,
        errs: errors,
      });
      return;
    }

    // Success!
    newList.save((err) => {
      if (err) return next(err);
      // Clean Cookies
      buildsHelper.clearBuildCookies(req, res, "curr");
      // Goto new build page
      res.redirect(`/builds/${newList._id}`);
    });
  },
];

exports.buildDetailGet = async (req, res, next) => {
  try {
    const { buildId } = req.params;
    const [ctgy, buildInfo] = await Promise.all([
      Category.find({}).sort({ name: 1 }),
      List.findById(buildId).populate("components.$*"),
    ]);

    if (!buildInfo) {
      // TODO: Handle by throwing different error page
      throw new Error("Build not found");
    }

    res.render("builds/build_detail", {
      title: buildInfo.build_name,
      author: `By ${buildInfo.author_name}`,
      description: buildInfo.description,
      thumbnail_url: buildInfo.thumbnail_url,
      categories: ctgy,
      comp_list: Object.fromEntries(buildInfo.components),
    });
  } catch (err) {
    return next(err);
  }
};
