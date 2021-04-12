var MongoClient = require("mongodb").MongoClient;
const { json } = require("body-parser");
var express = require("express");
var router = express.Router();
const { connect, dbName } = require("../conn");
let mqtt = require("mqtt");
let clients;
router.post("/manual", async (req, res) => {
  try {
    const client = await connect();
    if (!client) {
      throw new Error("error to connect");
    } else {
      if (!clients) {
        clients = await mqtt.connect({
          host: "pigateway.sytes.net",
          port: "1883",
        });
      }
      const db = client.db(dbName);
      let query = {
        uid: req.headers.uid,
        devicename: req.body.devicename,
        "automations.module": req.body.module,
      };
      let values = {
        $set: {
          "automations.$.action": req.body.action,
        },
      };
      await db
        .collection("sensors")
        .updateOne(query, values, function (err, result) {
          if (err) throw err;
          if (result) {
            res.status(200).send(result);
            //* Topic : UName/NodeName/control/Module
            //* Messagge : true or false
            clients.publish(req.body.mqttTopic, req.body.mqttMessage);
          }
        });
    }
  } catch (e) {
    return res.status(500).send(e.message);
  }
});

module.exports = router;
