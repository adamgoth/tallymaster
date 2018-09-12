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
  timeout: 60000,
  headers: { "x-api-key": config.apiKey }
});

async function getHistory() {
  var users = [
    {
      name: "apg129",
      membershipId: "4611686018433685165",
      characterId: "2305843009267349564"
    },
    {
      name: "Bruppus",
      membershipId: "4611686018441977141",
      characterId: "2305843009276956754"
    },
    {
      name: "Hank_Hanlo",
      membershipId: "4611686018429318835",
      characterId: "2305843009265819813"
    },
    {
      name: "HunkleMyDunkle",
      membershipId: "4611686018429329181",
      characterId: "2305843009278879052"
    },
    {
      name: "l3rockLanders",
      membershipId: "4611686018429402428",
      characterId: "2305843009270974650"
    },
    {
      name: "s-jel",
      membershipId: "4611686018428506453",
      characterId: "2305843009264672532"
    }
  ];

  var dataObject = {};
  for (var u = 0; u < users.length; u++) {
    var dataPresent = true;
    var page = 1;
    while (dataPresent) {
      var req = await instance.get(
        `Destiny2/2/Account/${users[u].membershipId}/Character/${
          users[u].characterId
        }/Stats/Activities?mode=5&page=${page}`
      );
      if (dig(req.data, "Response", "activities")) {
        var activities = req.data.Response.activities;
        for (var i = 0; i < activities.length; i++) {
          if (dataObject[activities[i].activityDetails.instanceId]) {
            dataObject[activities[i].activityDetails.instanceId] = {
              ...dataObject[activities[i].activityDetails.instanceId],
              [users[u].name]:
                activities[i].values.opponentsDefeated.basic.displayValue
            };
          } else {
            dataObject[activities[i].activityDetails.instanceId] = {
              [users[u].name]:
                activities[i].values.opponentsDefeated.basic.displayValue
            };
          }
        }
        console.log(
          `Fetching page ${page} from activity history for ${users[u].name}`
        );
        page++;
      } else {
        console.log(`End of results for ${users[u].name}`);
        dataPresent = false;
      }
    }
  }
  admin
    .database()
    .ref("/history")
    .set(dataObject);
  admin
    .database()
    .ref("/lastUpdated")
    .set(Date.now());
  console.log(`Database updated at ${new Date()}`);
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

app.get("/history", function(req, res) {
  admin
    .database()
    .ref("/")
    .once("value")
    .then(snapshot => {
      res.send(snapshot.val());
    });
});

//listener
app.listen(PORT, function() {
  console.log("App listening on PORT: " + PORT);
});
