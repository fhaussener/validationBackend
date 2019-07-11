var mongoose = require("mongoose");
var Schema = mongoose.Schema;

module.exports = mongoose.model(
  "Campaign",
  new Schema({
    userId: String,
    title: String,
    slug: String,
    description: String,
    videoUrl: String,
    coordinates: {
      latitude: Number,
      longitude: Number
    },
    question: {
      questionId: String
    }
  })
);
