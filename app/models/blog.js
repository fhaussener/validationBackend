var mongoose = require("mongoose");
var Schema = mongoose.Schema;

module.exports = mongoose.model(
  "Blog",
  new Schema({
    name: String,
    content: String
  })
);
