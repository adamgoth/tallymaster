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
var serviceAccount;
var config;

if (!process.env.FIREBASE_PRIVATE_KEY) {
  serviceAccount = require("./serviceAccountKey.json");
  config = require("./config.js");
}

if (process.env.FIREBASE_PRIVATE_KEY) {
  admin.initializeApp({
    credential: admin.credential.cert({
      private_key: process.env.FIREBASE_PRIVATE_KEY,
      client_email: process.env.FIREBASE_CLIENT_EMAIL
    }),
    databaseURL: "https://tallymaster-71adb.firebaseio.com/"
  });
} else {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://tallymaster-71adb.firebaseio.com/"
  });
}

var instance = axios.create({
  baseURL: "https://www.bungie.net/Platform/",
  timeout: 60000,
  headers: { "x-api-key": process.env.API_KEY || config.apiKey }
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: "application/vnd.api+json" }));

app.use(express.static(path.join(__dirname, "/client")));

//do destiny stuff
async function getHistory() {
  var users = [
    {
      name: "apg129",
      membershipId: "4611686018433685165",
      characterId: "2305843009267349301"
    },
    {
      name: "apg129",
      membershipId: "4611686018433685165",
      characterId: "2305843009267349303"
    },
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
      name: "Bruppus",
      membershipId: "4611686018441977141",
      characterId: "2305843009269306726"
    },
    {
      name: "Bruppus",
      membershipId: "4611686018441977141",
      characterId: "2305843009276956717"
    },
    {
      name: "Hank_Hanlo",
      membershipId: "4611686018429318835",
      characterId: "2305843009265819654"
    },
    {
      name: "Hank_Hanlo",
      membershipId: "4611686018429318835",
      characterId: "2305843009265819813"
    },
    {
      name: "Hank_Hanlo",
      membershipId: "4611686018429318835",
      characterId: "2305843009377317544"
    },
    {
      name: "HunkleMyDunkle",
      membershipId: "4611686018429329181",
      characterId: "2305843009278879052"
    },
    {
      name: "HunkleMyDunkle",
      membershipId: "4611686018429329181",
      characterId: "2305843009267666672"
    },
    {
      name: "l3rockLanders",
      membershipId: "4611686018429402428",
      characterId: "2305843009270974650"
    },
    {
      name: "l3rockLanders",
      membershipId: "4611686018429402428",
      characterId: "2305843009270974651"
    },
    {
      name: "l3rockLanders",
      membershipId: "4611686018429402428",
      characterId: "2305843009270974652"
    },
    {
      name: "s-jel",
      membershipId: "4611686018428506453",
      characterId: "2305843009264672531"
    },
    {
      name: "s-jel",
      membershipId: "4611686018428506453",
      characterId: "2305843009264672532"
    },
    {
      name: "s-jel",
      membershipId: "4611686018428506453",
      characterId: "2305843009264672533"
    }
  ];

  var dataObject = {};
  for (var u = 0; u < users.length; u++) {
    var dataPresent = true;
    var page = 0;
    while (dataPresent) {
      var req = await instance.get(
        `Destiny2/2/Account/${users[u].membershipId}/Character/${
          users[u].characterId
        }/Stats/Activities?mode=5&page=${page}`
      );
      if (req.error) {
        console.log(req);
      }
      if (dig(req.data, "Response", "activities")) {
        var activities = req.data.Response.activities;
        for (var i = 0; i < activities.length; i++) {
          if (new Date(activities[i].period) > new Date("2018-09-01")) {
            if (dataObject[activities[i].activityDetails.instanceId]) {
              dataObject[activities[i].activityDetails.instanceId] = {
                period: activities[i].period,
                results: {
                  ...dataObject[activities[i].activityDetails.instanceId]
                    .results,
                  [users[u].name]:
                    activities[i].values.opponentsDefeated.basic.displayValue
                }
              };
            } else {
              dataObject[activities[i].activityDetails.instanceId] = {
                period: activities[i].period,
                results: {
                  [users[u].name]:
                    activities[i].values.opponentsDefeated.basic.displayValue
                }
              };
            }
          }
        }
        console.log(
          `Fetching page ${page} from activity history for ${
            users[u].name
          }, character ${users[u].characterId}`
        );
        page++;
      } else {
        console.log(
          `End of results for ${users[u].name}, character ${
            users[u].characterId
          }`
        );
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
setInterval(getHistory, 600000);

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
