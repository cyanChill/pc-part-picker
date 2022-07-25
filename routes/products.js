const express = require("express");
const router = express.Router();

const cstmMiddleware = require("../helpers/customMiddleware");
const productsController = require("../controllers/productsController");

/* GET product create page. */
router.get("/create", productsController.productCreateGet);
/* POST product page */
router.post("/create", productsController.productCreatePost);

// Validate that productId is valid
router.use("/:productId", cstmMiddleware.validateProductId);
/* GET product detail page */
router.get("/:productId", productsController.productDetailGet);

/* POST add product to products list */
router.post("/:productId/add", productsController.productAddListPost);

/* Update product routes */
router.get("/:productId/update", productsController.productUpdateGet);
router.post("/:productId/update", productsController.productUpdatePost);
/* Delete categroy routes */
router.get("/:productId/delete", productsController.productDeleteGet);
router.post("/:productId/delete", productsController.productDeletePost);

module.exports = router;
