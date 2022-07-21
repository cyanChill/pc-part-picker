const express = require("express");
const router = express.Router();

const productsController = require("../controllers/productsController");

/* GET list of all products page. */
router.get("/", productsController.productsGet);

/* GET product create page. */
router.get("/create", productsController.productCreateGet);
/* POST product page */
router.post("/create", productsController.productCreatePost);

/* GET product detail page */
router.get("/:productId", productsController.productDetailGet);

module.exports = router;
