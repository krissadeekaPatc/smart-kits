var MongoClient = require("mongodb").MongoClient;
const { json } = require("body-parser");
var express = require("express");
var router = express.Router();
const { connect, dbName } = require("../conn");

async function getDeviceData(req, res) {
  try {
    const client = await connect();
    if (!client) {
      return res.send("CANNOT CONNECT TO DATABASE");
    } else {
      const db = client.db(dbName);

      let sensorCollection = db.collection("sensors");
      const myquery = {
        uid: req.headers.uid,
        uniqueName: req.headers.uname,
        devicename: req.headers.devicename,
      };
      const allDevice = await sensorCollection.find(myquery).toArray();

      if (allDevice.length <= 0) {
        res.send(true);
      } else {
        res.status(200).send(false);
      }
    }
  } catch (e) {
    console.log("GET IN CATCH: " + e);
    res.send("ERROR :" + e);
  }
}

router.get("/", async (req, res) => await getDeviceData(req, res));

module.exports = router;
