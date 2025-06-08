// Needed Resources 
const regValidate = require('../utilities/account-validation')
const express = require("express")
const utilities = require("../utilities/")
const router = new express.Router() 
const accountCont = require("../controllers/accountController")


// Route to build login view
router.get("/login", utilities.handleErrors(accountCont.buildLogin))

// Route to build registration view
router.get("/register", utilities.handleErrors(accountCont.buildRegister))

// Process the registration data
console.log("🧪 accountCont:", accountCont)
router.post(
  "/register",
  regValidate.registrationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountCont.registerAccount)
)

// Process the login attempt
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLogData,
  (req, res) => {
    res.status(200).send('login process')
  }
)

module.exports = router;