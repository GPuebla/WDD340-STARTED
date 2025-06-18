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
  
  const className = data.length > 0 ? data[0].classification_name : "No"

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

  const detail = await utilities.buildInventoryDetailGrid(data)
  let nav = await utilities.getNav()

  const vehicleName = `${data.inv_year} ${data.inv_make} ${data.inv_model}`
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

invCont.buildManagementView = async function (req, res, next) {
  let nav = await utilities.getNav()

  const classificationSelect = await utilities.buildClassificationList()

  res.render("./inventory/management", {
  title: "Inventory Management",
  nav,
  classificationSelect,
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
  try {
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
      classification_id 
    } = req.body

    const regResult = await invModel.addVehicle(
      inv_make,
      inv_model,
      Number(inv_year),
      inv_description,
      inv_image,
      inv_thumbnail,
      Number(inv_price),
      Number(inv_miles),
      inv_color,
      Number(classification_id)
    )

    const classifications = (await invModel.getClassifications()).rows

    if (regResult) {
      req.flash("notice", `Congratulations, you added ${inv_make} ${inv_model} successfully.`)
      res.status(201).render("inventory/addVehicle", {
        title: "Adding Vehicle Successfully",
        nav,
        errors: null,
        classifications
      })
    } else {
      req.flash("notice", "Sorry, the process failed.")
      res.status(501).render("inventory/addVehicle", {
        title: "Adding Vehicle Error",
        nav,
        errors: null,
        classifications
      })
    }
  } catch (error) {
    console.error("Error in addVehicle:", error.message)
    const nav = await utilities.getNav()
    const classifications = (await invModel.getClassifications()).rows
    req.flash("notice", "Sorry, the process failed.")
    res.status(500).render("inventory/addVehicle", {
      title: "Adding Vehicle Error",
      nav,
      errors: [error.message],
      classifications
    })
  }
}

/* ****************************************
*  Process to Add Classification
* *************************************** */
invCont.addClassification = async function (req, res) {
  try {
    let nav = await utilities.getNav()
    const { classification_name } = req.body

    const regResult = await invModel.addClassification(classification_name)

    const classifications = (await invModel.getClassifications()).rows

    if (regResult) {
      req.flash("notice", `Congratulations, you added the ${classification_name} category successfully.`)
      res.status(201).render("inventory/addClassification", {
        title: "Classification Added Successfully",
        nav,
        errors: null,
        classifications
      })
    } else {
      req.flash("notice", "Sorry, the process failed.")
      res.status(501).render("inventory/addClassification", {
        title: "Adding Classification Error",
        nav,
        errors: null,
        classifications
      })
    }
  } catch (error) {
    console.error("Error in addClassification:", error.message)
    const nav = await utilities.getNav()
    const classifications = (await invModel.getClassifications()).rows
    req.flash("notice", "Sorry, the process failed.")
    res.status(500).render("inventory/addClassification", {
      title: "Adding Classification Error",
      nav,
      errors: [error.message],
      classifications
    })
  }
}

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}

/* ***************************
 *  Build edit inventory view
 * ************************** */
invCont.editInventoryView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav()
  const itemData = await invModel.getInventoryByInvId(inv_id)

  console.log("Vehículo encontrado:", itemData)

  const classificationSelect = await utilities.buildClassificationList(itemData.classification_id)
  const classifications = (await invModel.getClassifications()).rows
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`
  res.render("./inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect: classificationSelect,
    classifications,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id
  })
}


/* ***************************
 *  Update Inventory Data
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body
  const updateResult = await invModel.updateInventory(
    inv_id,  
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  )

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model
    req.flash("notice", `The ${itemName} was successfully updated.`)
    res.redirect("/inv/")
  } else {
    const classificationSelect = await utilities.buildClassificationList(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the insert failed.")
    res.status(501).render("inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
    })
  }
}

/* ***************************
 *  Deliver Delete Confirmation View
 * ************************** */

invCont.deleteView = async function (req, res) {
  const inv_id = parseInt(req.params.inv_id);
  const itemData = await invModel.getInventoryByInvId(inv_id);
  const nav = await utilities.getNav();

  console.log('Car to delete:',itemData);

  res.render("inventory/delete-confirm", {
    title: "Delete " + itemData.inv_make + " " + itemData.inv_model,
    nav,
    item: itemData,
    errors: null,
  });
};

/* ***************************
 *  Delete Vehicle Data
 * ************************** */

invCont.deleteInventory = async function (req, res) {
  const inv_id = parseInt(req.body.inv_id);
  const result = await invModel.deleteInventoryItem(inv_id);
  const nav = await utilities.getNav();

  if (result) {
    req.flash("notice", "Vehicle successfully deleted.");
    res.redirect("/inv");
  } else {
    req.flash("notice", "Sorry, the delete failed.");
    res.redirect("/inv");
  }
};

module.exports = invCont;