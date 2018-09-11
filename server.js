//server dependencies
var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");
var axios = require("axios");

//helper functions
var dig = require("./util/helpers.js").dig;

//create instance of express
var app = express();
var PORT = process.env.PORT || 3001;

//initialize firebase
var admin = require("firebase-admin");
var serviceAccount = require("./serviceAccountKey.json");

//config
var config = require("./config.js");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://tallymaster-71adb.firebaseio.com/"
});

var instance = axios.create({
  baseURL: "https://www.bungie.net/Platform/",
  timeout: 3000,
  headers: { "x-api-key": config.apiKey }
});

async function getHistory() {
  var dataPresent = true;
  var page = 1;
  var dataObject = {};
  while (dataPresent) {
    var req = await instance.get(
      `Destiny2/2/Account/4611686018433685165/Character/2305843009267349564/Stats/Activities?mode=5&page=${page}`
    );
    if (dig(req.data, "Response", "activities")) {
      var activities = req.data.Response.activities;
      for (var i = 0; i < activities.length; i++) {
        dataObject[activities[i].activityDetails.instanceId] =
          activities[i].values.opponentsDefeated.basic.displayValue;
      }
      page++;
      console.log(page);
    } else {
      console.log("end");
      dataPresent = false;
      admin
        .database()
        .ref("/apg129")
        .set(dataObject);
    }
  }
}

getHistory();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: "application/vnd.api+json" }));

app.use(express.static(path.join(__dirname, "/client")));

//prevent CORS errors
app.use(function(req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader("Cache-Control", "no-cache");
  next();
});

//GET entries
app.get("/", function(req, res) {
  res.send("welcome");
});

//listener
app.listen(PORT, function() {
  console.log("App listening on PORT: " + PORT);
});
