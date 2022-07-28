const express = require("express");
const router = express.Router();

const indexController = require("../controllers/indexController");

/* Route to get the homepage. */
router.get("/", indexController.homeGet);

/* Route for offline fallback */
router.get("/offline", indexController.offlineGet);
router.get("/unsupported", indexController.unsupportedGet);

module.exports = router;
