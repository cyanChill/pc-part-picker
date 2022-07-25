const express = require("express");
const router = express.Router();

const cstmMiddleware = require("../helpers/customMiddleware");
const brandsController = require("../controllers/brandsController");

/* GET brands page. */
router.get("/", brandsController.brandsGet);

/* GET brand create page. */
router.get("/create", brandsController.brandCreateGet);
/* POST brand create page */
router.post("/create", brandsController.brandCreatePost);

// Validate that brandId is valid
router.use("/:brandId", cstmMiddleware.validateBrandId);
/* GET brand detail page */
router.get("/:brandId", brandsController.brandDetailGet);

// No need for update routes really

/* GET brand delete page. */
router.get("/:brandId/delete", brandsController.brandDeleteGet);
/* POST brand delete page */
router.post("/:brandId/delete", brandsController.brandDeletePost);

module.exports = router;
