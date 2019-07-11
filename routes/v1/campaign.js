var express = require('express');
var Campaign = require("../../app/models/campaign");
var getYouTubeID = require("get-youtube-id");
var slugs = require("slugs");
var router = express.Router();



router.get("/", function (req, res) {
  Campaign.find({}, function (err, campaign) {
    if (err) throw err;

    // object of all the blogs
    res.json({ campaigns: campaign });
  });
});

//route to add a campaigns - Create
router.post("/", function (req, res) {
  var youtubeId = getYouTubeID(req.body.videoUrl);
  var campaign = new Campaign({
    userId: req.body.userId,
    title: req.body.title,
    imageUrl: req.body.imageUrl,
    description: req.body.description,
    coordinates: {
      latitude: req.body.latitude,
      longitude: req.body.longitude
    },
    videoUrl: req.body.videoUrl,
    youtubeId: youtubeId,
    questions: {
      question: req.body.question,
      options: {
        answer1: req.body.answer1,
        answer2: req.body.answer2,
        answer3: req.body.answer3
      },
      rightAnswer: req.body.rightAnswer
    }
  });

  console.log(campaign);
  campaign.save(function (err) {
    if (err) throw err;

    res.send("Campaign saved successfully!");
  });
});

//route to show detail of one campaign - Read
router.get("/:id", function (req, res) {
  var id = req.params.id;
  Campaign.findOne({ slug: id }).then(function (camp) {
    if (!camp) throw new Error("No record found.");
    else {
      res.send(camp);
    }
  });
});


//Route to update the entries - Update
router.put("/:id", function (req, res) {
  var id = req.params.id;
  var youtubeId = getYouTubeID(req.body.videoUrl);
  console.log(id);
  const camp = {
    userId: req.body.userId,
    title: req.body.title,
    imageUrl: req.body.imageUrl,
    description: req.body.description,
    coordinates: {
      latitude: req.body.latitude,
      longitude: req.body.longitude
    },
    videoUrl: req.body.videoUrl,
    youtubeId: youtubeId,
    questions: {
      question: req.body.question,
      options: {
        answer1: req.body.answer1,
        answer2: req.body.answer2,
        answer3: req.body.answer3
      },
      rightAnswer: req.body.rightAnswer
    }
  };
  Campaign.update({ slug: id }, camp, function (err, raw) {
    if (err) {
      res.send(err);
    }
    res.send(raw);
  });
});


//delete entry in database - DELETE
router.delete("/:id", function (req, res) {
  var id = req.params.id;
  Campaign.remove({ slug: id }, function (err, raw) {
    if (err) {
      res.send(err);
    }
    res.send(raw);
  });
});

module.exports = router;