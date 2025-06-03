// Needed Resources 
const express = require("express")
const utilities = require("../utilities/")
const router = new express.Router() 
const accountCont = require("../controllers/accountController")


// Route to build login view
router.get("/login", utilities.handleErrors(accountCont.buildLogin))

// Route to build registration view
router.get("/register", utilities.handleErrors(accountCont.buildRegister))



module.exports = router;