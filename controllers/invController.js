const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
    errors: null,
  })
}

/* ***************************
 *  Build inventory detaill by inventory Id view
 * ************************** */

invCont.buildDetailByInvId  = async function (req, res, next) {
  const inv_id = req.params.InvId

  const data = await invModel.getInventoryByInvId(inv_id)

  const detail = await utilities.buildInventoryDetailGrid(data[0])
  let nav = await utilities.getNav()

  const vehicleName = `${data[0].inv_year} ${data[0].inv_make} ${data[0].inv_model}`
  res.render("./inventory/detail", {
  title: vehicleName,
  nav,
  detail,
  errors: null,
  })
}



/* ***************************
 *  Build inventory managment view
 * ************************** */

invCont.biuldManagement  = async function (req, res, next) {
  let nav = await utilities.getNav()

  res.render("./inventory/management", {
  title: "Vehicle Management",
  nav,
  errors: null,
  })
}

/* ***************************
 *  Build form to Add a new classification
 * ************************** */

invCont.addClassificationForm = async function (req, res, next) {
  let nav = await utilities.getNav()

    res.render("inventory/addClassification", {
      title: "Add new classification",
      errors: null,
      nav,
    })
}

/* ***************************
 *  Build form to Add a new vehicle
 * ************************** */

invCont.addVehicleForm  = async function (req, res, next) {
  let nav = await utilities.getNav()

  const result = await invModel.getClassifications()
  const classifications = result.rows

    res.render("inventory/addVehicle", {
      title: "Add new vehicle",
      errors: null,
      nav,
      classifications
    })
}



/* ****************************************
*  Process to Add Vehicle
* *************************************** */
invCont.addVehicle = async function (req, res) {
  let nav = await utilities.getNav()
  const { 
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id} = req.body

  const classificationId = Number(await invModel.getClassificationId(classification_id));

  const regResult = await invModel.addVehicle(
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classificationId
  )

  console.log("BODY:", req.body)
  console.log(regResult);

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re added ${inv_make} ${inv_model} successfully.`
    )
    res.status(201).render("inventory/addVehicle", {
      title: "Adding Vehicle Successfully",
      nav,
      errors: null,
    })
  } else {
    req.flash("notice", "Sorry, the process failed.")
    res.status(501).render("inventory/addVehicle", {
      title: "Adding Vehicle Error",
      nav,
      errors: null,
    })
  }
}


module.exports = invCont