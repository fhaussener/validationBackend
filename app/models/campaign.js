var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var slug = require("mongoose-slug-generator");
mongoose.plugin(slug);

module.exports = mongoose.model(
  "Campaign",
  new Schema({
    userId: String,
    title: String,
    slug: { type: String, slug: ["title"], unique: true },
    description: String,
    imageUrl: String,
    videoUrl: String,
    youtubeId: String,
    coordinates: {
      latitude: Number,
      longitude: Number
    },
    questions: {
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
