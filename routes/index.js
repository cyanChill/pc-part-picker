const express = require("express");
const router = express.Router();

const indexController = require("../controllers/indexController");

/* Route to get the homepage. */
router.get("/", indexController.homeGet);

module.exports = router;
