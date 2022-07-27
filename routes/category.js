const express = require("express");
const router = express.Router();

const cstmMiddleware = require("../helpers/customMiddleware");
const categoryController = require("../controllers/categoryController");

/* Route to get a list of all categories. */
router.get("/", categoryController.categoryGet);

/* Routes to handle creating a category. */
router.get("/create", categoryController.categoryCreateGet);
router.post("/create", categoryController.categoryCreatePost);

/*
  Using Middleware for specific route to validate the ":categoryId" dynamic
  value is valid (is an _id to an actual "Category" schema object).
*/
router.use("/:categoryId", cstmMiddleware.validateCategoryId);

/* Route to display all the products in the category. */
router.get("/:categoryId", categoryController.categoryDetailGet);

/* Routes to handle updating a category. */
router.get("/:categoryId/update", categoryController.categoryUpdateGet);
router.post("/:categoryId/update", categoryController.categoryUpdatePost);

/* Routes to handle deleting a category. */
router.get("/:categoryId/delete", categoryController.categoryDeleteGet);
router.post("/:categoryId/delete", categoryController.categoryDeletePost);

module.exports = router;
