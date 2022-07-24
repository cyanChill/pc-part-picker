const { body } = require("express-validator");

const buildsHelper = require("../helpers/buildsHelper");

const List = require("../models/list");

exports.validateBuildId = async (req, res, next) => {
  try {
    const buildExists = await List.findById(req.params.buildId);
    if (!buildExists) throw new Error("Build does not exist.");
    return next();
  } catch (err) {
    return next(err);
  }
};

exports.validateBuildSavePass = async (req, res, next) => {
  const { buildId } = req.params;
  // Check for save cookie if we previously wrote the save password for the build
  const prevSavePass = req.cookies[`${buildId}-save-pass`] || "";
  // Check to see if save password is valid
  const isValid = await buildsHelper.validateBuildSavePassword(
    buildId,
    prevSavePass
  );

  if (!isValid && prevSavePass !== process.env.ADMIN_PASSWORD) {
    // Remove currList cookie if invalid password
    res.clearCookie("currList");
    // Redirect to pass_validation route to obtain save password
    res.render("pass_validation", {
      title: "Build Save Password",
      passType: "Build Save",
      submitURL: `/builds/${buildId}/validateSavePass`,
    });
    return;
  }

  // Otherwise, refresh cookies (for 1h)
  res.cookie(`currList`, buildId, { maxAge: 3600000, httpOnly: true });
  res.cookie(`${buildId}-save-pass`, prevSavePass, {
    maxAge: 3600000,
    httpOnly: true,
  });
  next();
};

exports.validateBuildListInputs = [
  body("author_name", "Author Name must be >1 but <=30 characters long.")
    .trim()
    .isLength({ min: 1, max: 30 })
    .escape(),
  body("build_name", "Build Name must be >1 but <=30 characters long.")
    .trim()
    .isLength({ min: 1, max: 30 })
    .escape(),
  body("description", "Description must be >1 but <=200 characters long.")
    .trim()
    .isLength({ min: 1, max: 200 })
    .escape(),
  body("thumbnail_url", "Thumbnail URL must be a valid URL.").trim().isURL(),
];
