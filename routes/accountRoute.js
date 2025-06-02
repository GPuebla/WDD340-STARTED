// Needed Resources 
const express = require("express")
const router = new express.Router() 
const accountCont = require("../controllers/accountController")

// Route to build inventory by classification view
router.get("/login", accountCont.createAccount);



module.exports = router;