// Needed Resources 
const express = require("express")
const router = new express.Router() 
const buildError = require("../controllers/errorController")

// Route to create an intentional error
router.get("/error", buildError);


module.exports = router;
