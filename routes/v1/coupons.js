/**
 * Module dependencies.
 */
var express = require('express');
var randomstring = require("randomstring"); //used to generate a random string
var validate = require('express-validation') //used to validate the entries from validation
var validation = require('./validation/coupons'); //used for specifiing the 
var Coupon = require("../../app/models/coupon");
var router = express.Router();


/*
 * -------------- Routes --------------
 */

/**
 * POST /coupons
 * 
 * Route to add a campaigns - Create
 * 
 * @name post/
 * @param {string} path - path to /coupons
 * @param {callback} validation.createCoupon - validation for the right values
 * @param {callback} createCoupon - create function for creating new coupons
 */
router.post("/", validate(validation.createCoupon), function createCoupon(req, res) {
  //get all values from the request body
  var user = req.body.user;
  var campaign = req.body.campaign;
  var description = req.body.description;
  var begins = Math.floor(new Date() / 1000);
  var expires = begins + 86400;
  var code = randomstring.generate(6);


  //assign all values to a coupon object
  var coupon = new Coupon({
    description: description,
    type: "qr-code",
    code: code,
    campaign: campaign,
    user: user,
    timestamps: true,
    begins: begins,
    expires: expires,
    used: false
  });
  //save the coupon object in the Coupon model
  coupon.save(function (err, qr) {
    if (err) {
      //If save not successful, send error
      res.status(500).send({
        success: false,
        message: "Couldn't save coupon"
      })
    } else {
      //If save successful, send coupon object
      res.status(201).send({
        success: true,
        message: qr
      })
    }
  });
});

/**
 * GET /coupons/:id
 * 
 * Get a specific coupon through a given code.
 * @name get/:id
 * @param {string} path - path to /coupons/:id
 * @param {callback} getCoupon - get function for getting a coupon
 */
router.get("/:id", function getCoupon(req, res) {
  var code = req.params.id;
  //find the specific coupon via the variable code
  Coupon.findOne({ code: code }).then(function (coupon) {
    if (!coupon) {
      //If coupon not found, send error
      res.status(404).send({
        success: false,
        message: "ID not found (CODE_INVALID)",
      })
    }
    //If coupon found, send coupon object
    res.send(coupon);
  });
});


/**
 * PUT /coupons/:id
 * 
 * Update a specific coupon through a given code.
 * @name put/:id
 * @param {string} path - path to /coupons/:id
 * @param {callback} updateCoupon - update function for updating a coupon
 */
router.put("/:id", function updateCoupon(req, res) {
  var code = req.params.id;
  //update the value used from false to true
  const newCoupon = { used: true }

  //update the specific coupon with the newCoupon value
  Coupon.update({ code: code }, newCoupon, function (err, coupon) {
    if (err) {
      //If update not successful, send error
      res.status(500).send({
        success: false,
        message: "Couldn't update coupon"
      })
    }
    //find the updated coupon via the code on succesful update
    Coupon.findOne({ code: code }).then(function (coupon) {
      res.send(coupon)
    });
  });
});


/**
 * DELETE /coupons/:id
 * 
 * Delete a specific coupon through a given code.
 * @name delete/:id
 * @param {string} path - path to /coupons/:id
 * @param {callback} deleteCoupon - delete function for deleting a coupon
 */
router.delete("/:id", function deleteCoupon(req, res) {
  var code = req.params.id;
  //delete the specific coupon via the variable code
  Coupon.remove({ code: code }, function (err, _) {
    if (err) {
      //If delete not successful, send error
      res.status(500).send({
        success: false,
        message: "Couldn't delete coupon"
      })
    }
    res.send({
      //If delete was successful, send the deleted code with info
      message: code + "was deleted"
    });
  });
});


/**
 * GET /coupons
 * 
 * Get all coupons
 * @name get/
 * @param {string} path - path to /coupons/:id
 * @param {callback} getAll - get all entries the from the coupon database
 */
router.get("/", function getAll(req, res) {
  //find all coupons
  Coupon.find({}, function (err, coupons) {
    if (err) throw err;
    // object of all the blogs
    res.json({ coupons: coupons });
  });
});




module.exports = router;