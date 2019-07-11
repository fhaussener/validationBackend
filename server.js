/**
 * Module dependencies.
 */
require("dotenv").config({ path: __dirname + "/keys.env" });
var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var morgan = require("morgan");
var mongoose = require("mongoose");
var jwt = require("jsonwebtoken"); // used to create, sign, and verify tokens
var config = require("./config"); // get our config file
var User = require("./app/models/user"); // get our mongoose model
var admin = require("firebase-admin"); //firebase admin sdk for auth on custom server
var campaign = require('./routes/v1/campaign');
var coupons = require("./routes/v1/coupons");


const port = process.env.PORT || 8080; // used to create, sign, and verify tokens
const mongodbURI = "mongodb://localhost:27017/login";
mongoose.connect(mongodbURI); // connect to database


// use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const serviceAccount = require(process.env.FIREBASE_SERVICE_ACCOUNT_KEY_PATH);

//initalize the Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: ""
});

// use morgan to log requests to the console
app.use(morgan("dev"));

const cors = require("cors");
app.use(
  cors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
    optionsSuccessStatus: 204
  })
);

var apiRoutes = express.Router();


//temporary route for testing  todo: add this function to /login
apiRoutes.post("/login", function (req, res) {
  var idToken = req.body.refreshToken;
  admin
    .auth()
    .verifyIdToken(idToken)
    .then(function (decodedToken) {
      var uid = decodedToken.uid;
      res.send(uid);
    })
    .catch(function (error) {
      res.statusCode = 401;
      res.send(error);
    });
});


// route middleware to verify a token
apiRoutes.use(function (req, res, next) {
  if (req.path.indexOf("/coupons") === 0) { return next() };
  // check header or url parameters or post parameters for token
  var idToken =
    req.body.token || req.query.token || req.headers["x-access-token"];

  // decode token
  admin
    .auth()
    .verifyIdToken(idToken)
    .then(function (decodedToken) {
      var uid = decodedToken.uid;
      req.decoded = decodedToken;
      next();
    })
    .catch(function (error) {
      console.log(error);
      res.status(403).send({
        success: false,
        message: "No token provided."
      });
    });
});

// route to show random API-Landing message
apiRoutes.get("/", function (req, res) {
  res.json({ message: "Welcome to the coolest API on earth!" });
});

//User routes
// route to return all users
apiRoutes.get("/users", function (req, res) {
  User.find({}, function (err, users) {
    res.json(users);
  });
});

// route to return one user
apiRoutes.get("/users/:id", function (req, res) {
  res.send("no user specified");
});

// route to return one user
apiRoutes.get("/users/:id/campaigns", function (req, res) {
  res.send("No campaing for userid found");
});

// direct /campaign calls to campaign routes
apiRoutes.use('/campaigns', campaign);
// direct /coupons calls to coupons routes
apiRoutes.use("/coupons", coupons);

// apply the routes to application with the prefix /api
app.use("/api/v1", apiRoutes);

app.get("/", function (req, res) {
  res.send({ express: "Hello From Express" });
});

// =======================
// start the server ======
// =======================
if (!module.parent) {
  app.listen(port, () => console.log(`Listening on port ${port}`));
}


module.exports = app
