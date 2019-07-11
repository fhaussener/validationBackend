/**
 * Module dependencies.
 */
var Joi = require('joi');


module.exports = {
  /** validate the entries from POST /coupons */
  createCoupon: {
    body: {
      user: Joi.string().required(),
      campaign: Joi.string().required(),
      description: Joi.string().required(),
    }
  }
};