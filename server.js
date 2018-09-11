//server dependencies
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const axios = require("axios");

//create instance of express
const app = express();
const PORT = process.env.PORT || 3001;

//initialize firebase
const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "<dbURL"
});

admin
  .database()
  .ref("/" + "test")
  .set({
    test: "test"
  });

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
