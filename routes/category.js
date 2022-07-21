const express = require("express");
const router = express.Router();

const categoryController = require("../controllers/categoryController");

/* GET list of all category page. */
router.get("/", categoryController.categoryGet);

/* GET category create page. */
router.get("/create", categoryController.categoryCreateGet);
/* POST category page */
router.post("/create", categoryController.categoryCreatePost);

/* GET category detail page */
router.get("/:categoryId", categoryController.categoryDetailGet);

module.exports = router;
