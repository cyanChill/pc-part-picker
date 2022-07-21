const List = require("../models/list");

exports.homeGet = async (req, res, next) => {
  const results = await List.find({}).populate("components.$*").limit(7);

  const builds = results.map((build) => {
    let price = 0;
    build.components.forEach((val, key) => (price += val.price));
    build.price = `$${price}`;

    return build;
  });

  res.render("index", {
    title: "PC Parts List",
    completedBuilds: builds,
  });
};
