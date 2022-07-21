const { LocalStorage } = require("node-localstorage");
const localStorage = new LocalStorage("./scratch");

const { getCurrBuildInfo } = require("../helpers/buildsHelper");
const Category = require("../models/category");
const List = require("../models/list");

exports.buildGet = async (req, res, next) => {
  res.render("builds", {
    title: "Completed Builds",
  });
};

/* TESTING PURPOSES */
localStorage.setItem(
  "currBuild",
  JSON.stringify({
    CPU: {
      _id: "62d86f6a70ae17716c474e24",
      short_name: "AMD Ryzen 5 5600X",
      price: 199,
      image_url:
        "https://m.media-amazon.com/images/I/61vGQNUEsGL._AC_SL1384_.jpg",
      buy_link:
        "https://www.amazon.com/s?k=AMD%20Ryzen%205%205600X%206-core%2C%2012-Thread%20Unlocked%20Processor",
    },
  })
);

exports.buildCreateGet = async (req, res, next) => {
  const { categories, selectedProducts } = await getCurrBuildInfo();

  res.render("build_form", {
    title: "PC Builder",
    categories: categories,
    currList: selectedProducts,
  });
};

exports.buildComponentDelete = async (req, res, next) => {
  const { component } = req.body;
  // Destructure saved item, remove field, update local list
  let newBuildList = JSON.parse(localStorage.getItem("currBuild"));
  delete newBuildList[component];
  localStorage.setItem("currBuild", JSON.stringify(newBuildList));

  res.redirect("/builds/create");
};

exports.buildCreatePost = async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Create Builds POST Route");
};

exports.buildDetailGet = async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Builds Detail Page");
};
