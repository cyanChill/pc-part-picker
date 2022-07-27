const express = require("express");
const router = express.Router();

const cstmMiddleware = require("../helpers/customMiddleware");
const productsController = require("../controllers/productsController");

/* Routes to handle creating a product. */
router.get("/create", productsController.productCreateGet);
router.post("/create", productsController.productCreatePost);

/*
  Using Middleware for specific route to validate the ":productId" dynamic
  value is valid (is an _id to an actual "Product" schema object).
*/
router.use("/:productId", cstmMiddleware.validateProductId);

/* Route to display information on the current product. */
router.get("/:productId", productsController.productDetailGet);

/* Route to add a product to the current build list. */
router.post("/:productId/add", productsController.productAddListPost);

/* Routes to handle updating a product. */
router.get("/:productId/update", productsController.productUpdateGet);
router.post("/:productId/update", productsController.productUpdatePost);

/* Routes to handle deleting a product. */
router.get("/:productId/delete", productsController.productDeleteGet);
router.post("/:productId/delete", productsController.productDeletePost);

module.exports = router;
