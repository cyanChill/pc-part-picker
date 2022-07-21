const { LocalStorage } = require("node-localstorage");
const localStorage = new LocalStorage("./scratch");

const Category = require("../models/category");

exports.getCurrBuildInfo = async () => {
  const categories = await Category.find({}, "name").sort({ name: 1 });
  const prevItems = JSON.parse(localStorage.getItem("currBuild"));

  return { categories: categories, selectedProducts: prevItems };
};
