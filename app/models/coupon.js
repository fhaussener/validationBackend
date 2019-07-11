var mongoose = require("mongoose");
var Schema = mongoose.Schema;

module.exports = mongoose.model(
  "Coupon",
  new Schema({
    description: String,
    type: String,
    code: String,
    campaign: String,
    user: String,
    begins: Number,
    expires: Number,
    used: Boolean,
    date: { type: Date, default: Date.now },
  })
);
