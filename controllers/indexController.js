const buildsHelper = require("../helpers/buildsHelper");
const List = require("../models/list");

/* Gets up to 7 completed builds for the homepage */
exports.homeGet = async (req, res, next) => {
  const results = await List.find({}).populate("components.$*").limit(7);
  const builds = results ? results : [];

  const informizedBuilds = builds.map((build) =>
    buildsHelper.addBuildPriceField(build)
  );

  res.render("index", {
    title: "PC Parts List",
    completedBuilds: informizedBuilds,
  });
};

exports.offlineGet = async (req, res, next) => {
  res.render("redirect", {
    title: "You Are Offline!.",
    msg: "Sorry, but this page has not been cached.",
  });
};

exports.unsupportedGet = async (req, res, next) => {
  res.render("redirect", {
    title: "This Action Is Not Supported Offline.",
    msg: "Sorry, but this action is not supported offline. Please be connected to the internet in order to do this action",
  });
};
