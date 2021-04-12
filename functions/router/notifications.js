var MongoClient = require("mongodb").MongoClient;
const { json } = require("body-parser");
var express = require("express");
var router = express.Router();
const admin = require("firebase-admin");

router.post("/", (req, res) => {
  const url =
    "mongodb+srv://admin:1234@cluster0.z5vrr.mongodb.net/project_api?retryWrites=true&w=majority";
  const dbName = "project_api";
  MongoClient.connect(url, function (err, client) {
    if (err) throw err;
    var dbo = client.db(dbName);
    var query = { uid: req.headers.uid };
    dbo
      .collection("users")
      .find(query)
      .toArray(function (err, result) {
        if (err) throw err;
        const tokens = result[0];
        const tokensList = Object.values(tokens.registrationTokens);

        console.log(tokensList);
        let payload = {
          notification: {
            title: req.body.title,
            body: req.body.message,
            sound: "default",
          },
        };
        admin.messaging().sendToDevice(tokensList, payload);

        res.send("SENT!😤😤😤😤");

        // client.close();
      });
  });
});

// router.post("/", (req, res) => {
//   const url =
//     "mongodb+srv://admin:1234@cluster0.z5vrr.mongodb.net/project_api?retryWrites=true&w=majority";
//   const dbName = "project_api";

//   // MongoClient.connect(url, function (err, client) {
//   //     if (err) throw err;
//   //     var dbo = client.db(dbName);
//   //     var myquery = {
//   //         uid: req.headers.uid,
//   //     };
//   //     var newvalues = {
//   //         $push: {
//   //             "notifications": { "title": req.body.title, "body": req.body.body, "data": req.body.data !==null ? req.body.data : {}, "timestamp": req.body.timestamp !==null ? req.body.timestamp: Math.floor(Date.now() / 1000).toString() }
//   //         }
//   //     };
//   //     dbo.collection("users").updateMany(myquery, newvalues, function (err, result) {
//   //         if (err) throw err;
//   //         res.status(200).send(true)
//   //         client.close();
//   //     });
//   // });
// });

module.exports = router;
