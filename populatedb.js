#! /usr/bin/env node

/* 
  How to run: "node populatedb.js mongodb_uri_link"
*/

console.log(
  "This script populates some test brands, categories, and products to your database. Specified database as argument - e.g.: populatedb mongodb+srv://cooluser:coolpassword@cluster0.a9azn.mongodb.net/local_library?retryWrites=true"
);

// Get arguments passed on command line
const userArgs = process.argv.slice(2);

const sampleData = require("./sampleData");
const Brand = require("./models/brand");
const Category = require("./models/category");
const Product = require("./models/product");
const List = require("./models/list");

const mongoose = require("mongoose");
mongoose.connect(userArgs[0], {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

let brandIdRef = {};
let categoryIdRef = {};
let productIdRef = {};
let finalLists = [];

const brandCreate = async (brandName) => {
  try {
    const result = await Brand.create({ name: brandName });
    brandIdRef[brandName] = result._id;
  } catch (err) {
    console.log(`There was an error creating the Brand '${brandName}'`, err);
  }
};

const categoryCreate = async (categoryName) => {
  try {
    const result = await Category.create({ name: categoryName });
    categoryIdRef[categoryName] = result._id;
  } catch (err) {
    console.log(
      `There was an error creating the Category '${categoryName}'`,
      err
    );
  }
};

const productCreate = async (productInfo) => {
  try {
    const result = await Product.create(productInfo);
    productIdRef[productInfo.name] = result._id;
  } catch (err) {
    console.log(
      `There was an error creating the Product '${productInfo.name}'`,
      err
    );
  }
};

const listCreate = async (listInfo) => {
  try {
    const result = await List.create(listInfo);
    finalLists.push(result._doc);
  } catch (err) {
    console.log(`There was an error creating the List '${listInfo.name}'`, err);
  }
};

const createBrands = async () => {
  try {
    await Promise.all(sampleData.brands.map((brand) => brandCreate(brand)));
  } catch (err) {
    console.log(err);
  }
};

const createCategories = async () => {
  try {
    await Promise.all(
      sampleData.categories.map((category) => categoryCreate(category))
    );
  } catch (err) {
    console.log(err);
  }
};

const createProducts = async () => {
  const filledProducts = sampleData.products.map((productTemp) => ({
    ...productTemp,
    category: categoryIdRef[productTemp.category],
    brand: brandIdRef[productTemp.brand],
  }));

  try {
    await Promise.all(filledProducts.map((product) => productCreate(product)));
  } catch (err) {
    console.log(err);
  }
};

const createLists = async () => {
  const filledLists = sampleData.lists.map((listTemp) => {
    let productInfo = { ...listTemp };
    for (let comp in listTemp.components) {
      productInfo.components[comp] = productIdRef[listTemp.components[comp]];
    }
    return productInfo;
  });

  try {
    await Promise.all(filledLists.map((list) => listCreate(list)));
  } catch (err) {
    console.log(err);
  }
};

const populateData = async () => {
  try {
    await Promise.all([createBrands(), createCategories()]);
    await createProducts();
    await createLists();
    console.log(finalLists);
  } catch (err) {
    console.log(err);
  }

  mongoose.connection.close();
};

populateData();
