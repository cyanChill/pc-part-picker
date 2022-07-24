const express = require("express");
const router = express.Router();

const cstmMiddleware = require("../helpers/customMiddleware");
const buildsController = require("../controllers/buildsController");

/* GET list of completed builds page. */
router.get("/", buildsController.buildGet);

/* GET build create page. */
router.get("/create", buildsController.buildCreateGet);
/* POST build page */
router.post("/create", buildsController.buildCreatePost);

/* DELETE component in build list. */
router.post("/create/deleteComponent", buildsController.buildComponentDelete);

// Valdiate if buildId URL parameter is valid
router.use("/:buildId", cstmMiddleware.validateBuildId);
/* GET build detail page */
router.get("/:buildId", buildsController.buildDetailGet);

// Validate save-pass for build
router.use("/:buildId/update", cstmMiddleware.validateBuildSavePass);
/* GET & POST build detail update page */
router.get("/:buildId/update", buildsController.buildDetailUpdateGet);
router.post("/:buildId/update", buildsController.buildDetailUpdatePost);

/* POST Validate Build Save Password */
router.post(
  "/:buildId/validateSavePass",
  buildsController.buildValidateSavePassPost
);

/* GET & POST build detail delete page */
router.get("/:buildId/delete", buildsController.buildDetailDeleteGet);
router.post("/:buildId/delete", buildsController.buildDetailDeletePost);

module.exports = router;
