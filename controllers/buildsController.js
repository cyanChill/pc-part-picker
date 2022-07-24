const { body, validationResult } = require("express-validator");

const cstmMiddleware = require("../helpers/customMiddleware");
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
  // If we're updating a build, redirect to that page
  const currList = req.cookies.currList; // Get buildId if exists
  if (currList) return res.redirect(`/builds/${currList}/update`);

  // Getting current (local) build list
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
    const currList = req.cookies.currList; // Get buildId if exists
    await productHelper.removeItemFromList(
      res,
      req.body.ctgyId,
      currList ? "saved" : "curr"
    );
    res.redirect("/builds/create");
  } catch (err) {
    return next(err);
  }
};

exports.buildCreatePost = [
  ...cstmMiddleware.validateBuildListInputs,
  body("save_pass", "Password must be atleast 6 characters long.")
    .trim()
    .isLength({ min: 6 }),

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
    const newList = {
      author_name: req.body.author_name,
      build_name: req.body.build_name,
      description: req.body.description,
      thumbnail_url: req.body.thumbnail_url,
      components: currBuildMap,
      hashedSavePass: hashedPass,
    };

    if (!errors.isEmpty()) {
      return res.render("builds/build_form", {
        title: "PC Builder",
        categories: categories,
        comp_list: selectedProducts,
        prevData: newList,
        prevPass: req.body.save_pass,
        formError: true,
        errs: errors.errors,
      });
    }

    try {
      const newBuildList = await List.create(newList);
      // Clean Cookies
      buildsHelper.clearBuildCookies(req, res, "curr");
      // Goto new build page
      res.redirect(newBuildList.url_route);
    } catch (err) {
      return next(err);
    }
  },
];

exports.buildDetailGet = async (req, res, next) => {
  try {
    const { buildId } = req.params;
    const buildInfo = req.body.buildData;
    const ctgy = await Category.find({}).sort({ name: 1 });

    res.render("builds/build_detail", {
      title: buildInfo.build_name,
      author: `By ${buildInfo.author_name}`,
      description: buildInfo.description,
      thumbnail_url: buildInfo.thumbnail_url,
      buildId: buildId,
      categories: ctgy,
      comp_list: Object.fromEntries(buildInfo.components),
    });
  } catch (err) {
    return next(err);
  }
};

exports.buildDetailUpdateGet = async (req, res, next) => {
  const { buildId } = req.params;
  const oldListData = req.body.buildData;
  // Get build data + list from cookies of the saved list we want to update
  const { categories, selectedProducts } = await buildsHelper.getBuildInfo(
    req,
    "saved"
  );

  res.render("builds/build_form", {
    title: "Updating Build",
    categories: categories,
    comp_list: selectedProducts,
    prevData: oldListData,
    updating: true,
  });
};

exports.buildDetailUpdatePost = [
  ...cstmMiddleware.validateBuildListInputs,

  async (req, res, next) => {
    const errors = validationResult(req);
    const { categories, selectedProducts } = await buildsHelper.getBuildInfo(
      req,
      "saved"
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

    let updatedContents = {
      author_name: req.body.author_name,
      build_name: req.body.build_name,
      description: req.body.description,
      thumbnail_url: req.body.thumbnail_url,
      components: currBuildMap,
    };

    if (!errors.isEmpty()) {
      updatedContents._id = req.params.buildId;
      return res.render("builds/build_form", {
        title: "PC Builder",
        categories: categories,
        comp_list: selectedProducts,
        prevData: updatedContents,
        updating: true,
        formError: true,
        errs: errors.errors,
      });
    }

    // Success!
    List.findByIdAndUpdate(
      req.params.buildId,
      updatedContents,
      function (err, updatedBuild) {
        if (err) return next(err);
        // Clear saved build related cookies
        buildsHelper.cleanUpSaveBuildCookies(req, res, updatedBuild._id);
        // Successful - redirect to build detail page
        res.redirect(updatedBuild.url_route);
      }
    );
  },
];

exports.buildDetailCancelGet = async (req, res, next) => {
  // Clear saved build related cookies
  buildsHelper.cleanUpSaveBuildCookies(req, res, req.params.buildId);
  res.redirect("/");
};

exports.buildValidateSavePassPost = [
  body("save_pass", "Password must be atleast 6 characters long.")
    .trim()
    .isLength({ min: 6 }),

  async (req, res, next) => {
    const { buildId } = req.params;
    const errors = validationResult(req);

    const isValid = await buildsHelper.validateBuildSavePassword(
      buildId,
      req.body.save_pass
    );

    if (
      !errors.isEmpty() ||
      (!isValid && req.body.save_pass !== process.env.ADMIN_PASSWORD)
    ) {
      // Redisplay pass_validation page
      return res.render("pass_validation", {
        title: "Build Save Password",
        passType: "Build Save",
        prevAttempt: req.body.save_pass,
        error: "Invalid Password.",
      });
    }

    // Save/refresh valid save password as cookie (for 1h)
    res.cookie(`${buildId}-saved-pass`, req.body.save_pass, {
      maxAge: 3600000,
      httpOnly: true,
    });

    // If we update a different build (or time expires)
    if (!req.cookies.currList || req.cookies.currList !== buildId) {
      // Clear prev saved list cookies & load saved list components to cookies
      await buildsHelper.addSavedBuildInfoToCookies(res, buildId);
    }

    res.redirect(req.body.redirect_route);
  },
];

exports.buildDetailDeleteGet = async (req, res, next) => {
  const { buildId } = req.params;

  res.render("builds/build_delete", {
    title: "Delete Build?",
    buildId: buildId,
  });
};

exports.buildDetailDeletePost = async (req, res, next) => {
  try {
    await List.findByIdAndDelete(req.params.buildId);
    // Clear saved build related cookies
    buildsHelper.cleanUpSaveBuildCookies(req, res, req.params.buildId);
    res.redirect("/");
  } catch (err) {
    return next(err);
  }
};
