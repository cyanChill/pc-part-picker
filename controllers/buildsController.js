const buildsHelper = require("../helpers/buildsHelper");
const productHelper = require("../helpers/productHelper");
const Category = require("../models/category");
const List = require("../models/list");

exports.buildGet = async (req, res, next) => {
  const results = await List.find({}).populate("components.$*");
  const builds = results ? results : [];

  const informizedBuilds = builds.map((build) =>
    buildsHelper.addBuildPriceField(build)
  );

  try {
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

exports.buildCreatePost = async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Create Builds POST Route");
};

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
