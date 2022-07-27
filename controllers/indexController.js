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
