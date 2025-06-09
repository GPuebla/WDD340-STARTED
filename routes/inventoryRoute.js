// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// Route to build inventory item detail view
router.get("/detail/:InvId", invController.buildDetailByInvId);

// Route to biuld a management view
router.get("/", invController.biuldManagement);

// Route to the addVehicle form
router.get("/addVehicle", invController.addVehicle);

// Route to the addClassification form
router.get("/addClassification", invController.addClassification);


// Route to add a new vehicle
router.post("/addVheicle", async (req, res) => {
  const data = req.body
  res.send("Vehicle Added")
})


module.exports = router;