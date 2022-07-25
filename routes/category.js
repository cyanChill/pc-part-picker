const express = require("express");
const router = express.Router();

const cstmMiddleware = require("../helpers/customMiddleware");
const categoryController = require("../controllers/categoryController");

/* GET list of all category page. */
router.get("/", categoryController.categoryGet);

/* GET category create page. */
router.get("/create", categoryController.categoryCreateGet);
/* POST category page */
router.post("/create", categoryController.categoryCreatePost);

// Validate that categoryId is valid
router.use("/:categoryId", cstmMiddleware.validateCategoryId);
/* GET category detail page */
router.get("/:categoryId", categoryController.categoryDetailGet);

/* Update category routes */
router.get("/:categoryId/update", categoryController.categoryUpdateGet);
router.post("/:categoryId/update", categoryController.categoryUpdatePost);
/* Delete categroy routes */
router.get("/:categoryId/delete", categoryController.categoryDeleteGet);
router.post("/:categoryId/delete", categoryController.categoryDeletePost);

module.exports = router;
