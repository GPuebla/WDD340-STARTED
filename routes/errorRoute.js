// Needed Resources 
const express = require("express")
const router = new express.Router() 
const errorController = require("../controllers/errorController")

// Route to create an intentional error
router.get("/error", errorController.buildError);


module.exports = router;
