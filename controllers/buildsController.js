const { body, validationResult } = require("express-validator");

const filesHelper = require("../helpers/filesHelper");
const cstmMiddleware = require("../helpers/customMiddleware");
const buildsHelper = require("../helpers/buildsHelper");
const productHelper = require("../helpers/productHelper");
const hashHelper = require("../helpers/hashHelper.js");

const Category = require("../models/category");
const List = require("../models/list");

/* Function to handle getting a list of all completed builds. */
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

/* Function to render the form for creating a build. */
exports.buildCreateGet = async (req, res, next) => {
  // If we're updating a build, redirect to that page
  const currList = req.cookies.currList; // Get buildId if exists
  if (currList) return res.redirect(`/builds/${currList}/update`);

  // Getting current (local) build list
  try {
    const { ctgies, selProds } = await buildsHelper.getBuildInfo(req, "curr");
    res.render("builds/build_form", {
      title: "PC Builder",
      categories: ctgies,
      comp_list: selProds,
    });
  } catch (err) {
    return next(err);
  }
};

/*
  Function to handle the form submission of creating a build.
    ⭐ Image is not editable after creation.
*/
exports.buildCreatePost = [
  ...cstmMiddleware.validateBuildListInputs,
  body("save_pass", "Password must be atleast 6 characters long.")
    .trim()
    .isLength({ min: 6 }),

  async (req, res, next) => {
    const errors = validationResult(req);
    const { ctgies, selProds } = await buildsHelper.getBuildInfo(req, "curr");

    if (Object.keys(selProds).length === 0) {
      errors.errors.push({ msg: "Build must contain at least one component." });
    }
    // Hash the save password
    const hashedPass = await hashHelper.hashPassword(req.body.save_pass);
    // Create a map for the components (as part of our build "List" schema)
    const currBuildMap = new Map();
    for (const compName in selProds) {
      currBuildMap.set(compName, selProds[compName]._id);
    }
    // The object that will potentially be a new build list
    let newList = {
      author_name: req.body.author_name,
      build_name: req.body.build_name,
      description: req.body.description,
      components: currBuildMap,
      hashedSavePass: hashedPass,
    };

    /* File Validation */
    filesHelper.validateImg(req.file, errors.errors);

    if (!errors.isEmpty()) {
      return res.render("builds/build_form", {
        title: "PC Builder",
        categories: ctgies,
        comp_list: selProds,
        prevData: newList,
        prevPass: req.body.save_pass,
        formError: true,
        errs: errors.errors,
      });
    }

    try {
      // Success! - Update Image Format to .webp
      const newPathName = await filesHelper.convertImgToWEBP(req.file.buffer);
      newList.imgPath = newPathName;

      const newBuildList = await List.create(newList);
      // Clean Cookies used for creating the build list
      buildsHelper.clearBuildCookies(req, res, "curr");
      res.redirect(newBuildList.url_route); // Goto new build page
    } catch (err) {
      return next(err);
    }
  },
];

/*
  Function to handle when we want to remove a component from the current
  build list (new or previously existing one) — involves deleting the
  cookie for that component type.
*/
exports.buildComponentDelete = async (req, res, next) => {
  try {
    // See if we're updating a build or not
    const currList = req.cookies.currList;
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

/*  Function to render the page describing the current build. */
exports.buildDetailGet = async (req, res, next) => {
  try {
    const buildInfo = buildsHelper.addBuildPriceField(req.body.buildData);
    const ctgy = await Category.find({}).sort({ name: 1 });
    res.render("builds/build_detail", {
      title: buildInfo.build_name,
      buildInfo: buildInfo,
      totalPrice: buildInfo.price,
      categories: ctgy,
      comp_list: Object.fromEntries(buildInfo.components),
    });
  } catch (err) {
    return next(err);
  }
};

/*
  Function to check to see whether the user entered a valid save password
  for the current build.
*/
exports.buildValidateSavePassPost = [
  body("save_pass", "Password must be atleast 6 characters long.")
    .trim()
    .isLength({ min: 6 }),

  async (req, res, next) => {
    const { buildId } = req.params;
    const errors = validationResult(req);
    // See if the save-password is valid
    const isValid = await buildsHelper.validateBuildSavePassword(
      buildId,
      req.body.save_pass
    );

    if (
      !errors.isEmpty() ||
      (!isValid && req.body.save_pass !== process.env.ADMIN_PASSWORD)
    ) {
      // Redisplay pass_validation page since we have errors
      return res.redirect(`/builds/${buildId}/update`);
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

/*
  Function to handle when the user wants to cancel updating/deleting the 
  current build.
*/
exports.buildDetailCancelGet = async (req, res, next) => {
  // Clear saved build related cookies
  buildsHelper.cleanUpSaveBuildCookies(req, res, req.params.buildId);
  res.redirect(`/builds/${req.params.buildId}`);
};

/* Function to render the form for updating a build. */
exports.buildDetailUpdateGet = async (req, res, next) => {
  // For the content in the "finalize data part of teh form"
  const oldListData = req.body.buildData;
  // Get build data + list from cookies of the saved list we want to update
  const { ctgies, selProds } = await buildsHelper.getBuildInfo(req, "saved");
  res.render("builds/build_form", {
    title: "Updating Build",
    categories: ctgies,
    comp_list: selProds,
    prevData: oldListData,
    isUpdating: true,
  });
};

/* Function to handle the form submission of updating a build. */
exports.buildDetailUpdatePost = [
  ...cstmMiddleware.validateBuildListInputs,

  async (req, res, next) => {
    const errors = validationResult(req);
    const { ctgies, selProds } = await buildsHelper.getBuildInfo(req, "saved");

    if (Object.keys(selProds).length === 0) {
      errors.errors.push({ msg: "Build must contain at least one component." });
    }

    const currBuildMap = new Map();
    for (const compName in selProds) {
      currBuildMap.set(compName, selProds[compName]._id);
    }

    let updatedContents = {
      author_name: req.body.author_name,
      build_name: req.body.build_name,
      description: req.body.description,
      components: currBuildMap,
    };

    if (!errors.isEmpty()) {
      return res.render("builds/build_form", {
        title: "PC Builder",
        categories: ctgies,
        comp_list: selProds,
        prevData: updatedContents,
        isUpdating: true,
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
        res.redirect(updatedBuild.url_route); // Goto build detail page
      }
    );
  },
];

/*
  Function to render the form for deleting a build list.
    ⭐ Don't need any other checks as nothing is dependent on a build.
*/
exports.buildDetailDeleteGet = async (req, res, next) => {
  res.render("builds/build_delete", {
    title: "Delete Build?",
    buildId: req.params.buildId,
  });
};

/*
  Function to handle the form submission of deleting a build list.
    ⭐ Don't need any other checks as nothing is dependent on a build.
*/
exports.buildDetailDeletePost = async (req, res, next) => {
  try {
    const result = await List.findByIdAndDelete(req.params.buildId);
    await filesHelper.deleteFileByPath(result.imgPath); // Delete the file
    // Clear saved build related cookies
    buildsHelper.cleanUpSaveBuildCookies(req, res, req.params.buildId);
    res.redirect("/");
  } catch (err) {
    return next(err);
  }
};
