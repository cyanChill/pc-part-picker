const express = require("express");
const router = express.Router();

const cstmMiddleware = require("../helpers/customMiddleware");
const buildsController = require("../controllers/buildsController");

/* Route to get a list of all completed builds. */
router.get("/", buildsController.buildGet);

/* Routes to handle creating a build list. */
router.get("/create", buildsController.buildCreateGet);
router.post("/create", buildsController.buildCreatePost);

/*
  Route for handling when we want to remove a component from the build 
  list (when creating or editing).
*/
router.post("/create/deleteComponent", buildsController.buildComponentDelete);

/*
  Using Middleware for specific route to validate the ":buildId" dynamic
  value is valid (is an _id to an actual "Build" schema object).
*/
router.use("/:buildId", cstmMiddleware.validateBuildId);

/* Route to display a page describing the current build. */
router.get("/:buildId", buildsController.buildDetailGet);

/* 
  Middleware to validate that the user knows the build's save password
  before attempting to update or delete the build.
*/
router.use("/:buildId/update", cstmMiddleware.validateBuildSavePass);
router.use("/:buildId/delete", cstmMiddleware.validateBuildSavePass);
/*
  Route for checking whether the user inputted a valid save password for 
  the build (for updating or deleting).
*/
router.post(
  "/:buildId/validateSavePass",
  buildsController.buildValidateSavePassPost
);

/* Route for canceling updating or deleting a build. */
router.get("/:buildId/cancel", buildsController.buildDetailCancelGet);

/* Routes to handle updating a build. */
router.get("/:buildId/update", buildsController.buildDetailUpdateGet);
router.post("/:buildId/update", buildsController.buildDetailUpdatePost);

/* Routes to handle deleting a build. */
router.get("/:buildId/delete", buildsController.buildDetailDeleteGet);
router.post("/:buildId/delete", buildsController.buildDetailDeletePost);

module.exports = router;
