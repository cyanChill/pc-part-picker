const express = require("express");
const router = express.Router();

const productsController = require("../controllers/productsController");

/* GET product create page. */
router.get("/create", productsController.productCreateGet);
/* POST product page */
router.post("/create", productsController.productCreatePost);

/* GET product detail page */
router.get("/:productId", productsController.productDetailGet);

/* POST add product to products list */
router.post("/:productId/add", productsController.productAddListPost);

module.exports = router;
