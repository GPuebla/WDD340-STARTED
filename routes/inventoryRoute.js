// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const regValidate = require('../utilities/account-validation')
const utilities = require("../utilities/");

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// Route to build inventory item detail view
router.get("/detail/:InvId", invController.buildDetailByInvId);

// Route to biuld a management view
router.get("/", invController.buildManagementView);

// Route to the addVehicle form
router.get("/addVehicle", invController.addVehicleForm);

// Route to the addClassification form
router.get("/addClassification", invController.addClassificationForm);


// Route to add a new vehicle
router.post("/addVehicle",
    regValidate.addVehicleRules(),
    regValidate.checkVehicleData,
    invController.addVehicle
);

// Route to add a new classification
router.post("/addClassification", invController.addClassification)

// Route to add a new classification
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))

/* *******************************
 * Route to build edit inventory view
 * URL: /inv/edit/:inv_id
 * Method: GET
 ********************************/
router.get("/edit/:inv_id", utilities.handleErrors(invController.editInventoryView))

router.post("/update/", invController.updateInventory)

module.exports = router;