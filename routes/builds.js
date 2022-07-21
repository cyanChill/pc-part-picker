const express = require("express");
const router = express.Router();

const buildsController = require("../controllers/buildsController");

/* GET list of completed builds page. */
router.get("/", buildsController.buildGet);

/* GET build create page. */
router.get("/create", buildsController.buildCreateGet);
/* POST build page */
router.post("/create", buildsController.buildCreatePost);

/* DELETE component in build list. */
router.post("/create/deleteComponent", buildsController.buildComponentDelete);

/* GET build detail page */
router.get("/:buildId", buildsController.buildDetailGet);

module.exports = router;
