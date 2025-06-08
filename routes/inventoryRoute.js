// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// Route to build inventory item detail view
router.get("/detail/:InvId", invController.buildDetailByInvId);

// Route to add a new inventory
router.get("/", invController.biuldManagement);

// Route to add a new inventory
router.get("/addInventory", invController.addInventory);

// Route to add a new classification
router.get("/addClassification", invController.addClassification);


module.exports = router;