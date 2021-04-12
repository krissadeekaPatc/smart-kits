var MongoClient = require("mongodb").MongoClient;
const { json } = require("body-parser");
const { connect } = require("../conn");
var express = require("express");
var router = express.Router();

router.get("/", (req, res) => {
  const url =
    "mongodb+srv://admin:1234@cluster0.z5vrr.mongodb.net/project_api?retryWrites=true&w=majority";
  const dbName = "project_api";
  MongoClient.connect(url, function (err, client) {
    if (err) throw err;
    var dbo = client.db(dbName);
    var query = {
      uid: req.headers.uid,
      // uniqueName: req.headers.uniqueName,
    };

    dbo
      .collection("users")
      .find(query)
      .toArray(function (err, result) {
        if (err) throw err;
        res.send(result);
        client.close();
      });
  });
});
module.exports = router;
