const utilities = require("../utilities/")
const accountModel = require("../models/account-model")
const accountCont = {}

/* ****************************************
*  Deliver login view
* *************************************** */
// accountCont.buildLogin = async function (req, res, next) {
//     let nav = await utilities.getNav()
//     res.render("account/login", {
//       title: "Login",
//       nav,
//       errors: null,
//     })
// }

accountCont.buildLogin = async function (req, res, next) {
  try {
    console.log("🔍 Entrando a buildLogin...")

    let nav = await utilities.getNav()
    console.log("✅ Nav generado correctamente")

    res.render("account/login", {
      title: "Login",
      nav,
      error: null,
    })
  } catch (error) {
    console.error("❌ Error en buildLogin:", error)
    next(error)  // Esto permite que handleErrors() lo capture
  }
}


/* ****************************************
*  Deliver registration view
* *************************************** */
accountCont.buildRegister = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null,
  })
}



/* ****************************************
*  Process Registration
* *************************************** */
accountCont.registerAccount = async function (req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    account_password
  )

  console.log("BODY:", req.body)

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    )
    res.status(201).render("account/login", {
      title: "Login",
      nav,
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
    })
  }
}

module.exports = accountCont;