var MongoClient = require("mongodb").MongoClient;
const { json } = require("body-parser");
const { connect, dbName } = require("../conn");
var express = require("express");
var router = express.Router();

async function getData(req, res) {
  const client = await connect();

  const dbo = client.db(dbName);

  if (!client) {
    res.send("SORRY CANNOT CONNECT TO DATABASE");
  } else {
    try {
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
    } catch (e) {
      res.send(e);
    }
  }
}

router.get("/", (req, res) => getData(req, res));

module.exports = router;
