const express = require("express");
const router = express.Router();

const cstmMiddleware = require("../helpers/customMiddleware");
const brandsController = require("../controllers/brandsController");

/* Route to get a list of ALL brands. */
router.get("/", brandsController.brandsGet);

/* Routes to handle creating a brand. */
router.get("/create", brandsController.brandCreateGet);
router.post("/create", brandsController.brandCreatePost);

/*
  Using Middleware for specific route to validate the ":brandId" dynamic
  value is valid (is an _id to an actual "Brand" schema object).
*/
router.use("/:brandId", cstmMiddleware.validateBrandId);

/* Route to get a list of all products by the current brand. */
router.get("/:brandId", brandsController.brandDetailGet);

/* No UPDATE route since brands don't change their names frequently. */

/* Routes to handle deleting a brand. */
router.get("/:brandId/delete", brandsController.brandDeleteGet);
router.post("/:brandId/delete", brandsController.brandDeletePost);

module.exports = router;
