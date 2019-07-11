var mongoose = require("mongoose");
var Schema = mongoose.Schema;

module.exports = mongoose.model(
  "questions",
  new Schema({
    questions: {
      campaignId: String,
      question: String,
      options: {
        answer1: String,
        answer2: String,
        answer3: String
      },
      rightAnswer: String
    }
  })
);
