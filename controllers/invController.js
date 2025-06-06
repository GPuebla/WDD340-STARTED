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
  })
}

/* ***************************
 *  Build inventory detaill by inventory Id view
 * ************************** */

invCont.buildDetailByInvId  = async function (req, res, next) {
  const inv_id = req.params.InvId
    
  console.log('I got the '+inv_id+ " Id")

  const data = await invModel.getInventoryByInvId(inv_id)

  const detail = await utilities.buildInventoryDetailGrid(data[0])
  let nav = await utilities.getNav()

  const vehicleName = `${data[0].inv_year} ${data[0].inv_make} ${data[0].inv_model}`
  res.render("./inventory/detail", {
  title: vehicleName,
  nav,
  detail,
  })
}


module.exports = invCont