const invModel = require("../models/inventory-model")
const Util = {}
const jwt = require("jsonwebtoken")
require("dotenv").config()

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = '<ul id="nav-list">'
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicleDatas">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}


/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid
  console.log(data.length)
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      grid += '<li>'
      grid +=  '<a href="/inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + 'details"><img src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += '<hr />'
      grid += '<h2>'
      grid += '<a href="/inv/detail/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

/* **************************************
* Build the Inventory Details view HTML
* ************************************ */
Util.buildInventoryDetailGrid = async function(vehicleData) {
  let detail = "";

  if (vehicleData) {
    detail += `
      <section class="vehicle-detail">
        <div class="vehicle-card">
          <img class="vehicle-image" src="${vehicleData.inv_image}" alt="Image of ${vehicleData.inv_make} ${vehicleData.inv_model}" />
          <div class="vehicle-info">
            <h2 class="vehicle-title">${vehicleData.inv_year} ${vehicleData.inv_make} ${vehicleData.inv_model}</h2>
            <p class="vehicle-price"><strong>Price:</strong> $${new Intl.NumberFormat('en-US').format(vehicleData.inv_price)}</p>
            <ul class="vehicle-specs">
              <li><strong>Color:</strong> ${vehicleData.inv_color}</li>
              <li><strong>Miles:</strong> ${new Intl.NumberFormat('en-US').format(vehicleData.inv_miles)} miles</li>
              <li><strong>Description:</strong> ${vehicleData.inv_description}</li>
            </ul>
          </div>
        </div>
      </section>
    `;
  } else {
    detail += `<p class="notice">Sorry, no matching vehicle found.</p>`;
  }

  return detail;
};

/* ************************
 * Build the classification list view HTML
 ************************** */

Util.buildClassificationList =  async function (selectedId = null) {
  let data = await invModel.getClassifications()
  let list = '<select id="classificationList" name="classification_id">'
  list += '<option value="">Choose a classification</option>'
  data.rows.forEach(row => {
    list += `<option value="${row.classification_id}" ${selectedId == row.classification_id ? "selected" : ""}>${row.classification_name}</option>`
  })
  list += '</select>'
  return list
}

/* ************************
 * Build the inventory management view HTML
 ************************** */
Util.getLinks = async function (req, res, next) {
  let list = '<ul id="nav-managementLinks">'
  list += '<li><a href="/" title="Home page">Home</a></li>'
  list += '<li><a href="/" title="Home page">Home</a></li>'
  list += "</ul>"
return links
}

/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {

 if (req.cookies.jwt) {

  jwt.verify(
   req.cookies.jwt,
   process.env.ACCESS_TOKEN_SECRET,
   function (err, accountData) {
    if (err) {

     req.flash("Please log in")
     res.clearCookie("jwt")
     return res.redirect("/account/login")
    }


    res.locals.accountData = accountData
    res.locals.loggedin = 1
    next()
   })
 } else {
  next()
 }
}



/* ****************************************
 *  Check Login
 * ************************************ */
 Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next()
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
 }


/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = Util
