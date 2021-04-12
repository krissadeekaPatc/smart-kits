const express = require("express");
const router = express.Router();
const { connect, dbName } = require("../conn");

router.get("/get_automation", async (req, res) => {
  try {
    const client = await connect();
    if (!client) {
      throw new Error("error to connect");
    } else {
      const db = client.db(dbName);
      let query = {
        uid: req.headers.uid,
        // uniqueName: req.headers.uniqueName,
      };
      let projection = {
        _id: false,
        devicename: true,
        uniqueName: true,
        automations: true,
      };
      await db
        .collection("sensors")
        .find(query, { projection })
        .toArray(function (err, result) {
          if (err) throw err;
          res.status(200).send(result);
          client.close();
        });
    }
  } catch (e) {
    return res.status(500).send(e.message);
  }
});

router.patch("/", async (req, res) => {
  try {
    const client = await connect();
    if (!client) {
      throw new Error("error to connect");
    } else {
      const db = client.db(dbName);
      let query = {
        uid: req.headers.uid,
        devicename: req.body.devicename,
        "automations.module": req.body.module,
      };
      let values = {
        $set: {
          "automations.$.mode": req.body.mode,
          "automations.$.node_target": req.body.node_target,
          "automations.$.sensor_target": req.body.sensor_target,
          "automations.$.operator": req.body.operator,
          "automations.$.value": req.body.value,
          "automations.$.str_time": req.body.str_time,
          "automations.$.end_time": req.body.end_time,
          "automations.$.action": req.body.action,
        },
      };
      await db
        .collection("sensors")
        .updateOne(query, values, function (err, result) {
          if (err) throw err;
          if (result) {
            res.status(200).send("seccess : status 200");
            client.close();
          }
        });
    }
  } catch (e) {
    return res.status(500).send({
      error_message: e.message,
    });
  }
});

router.get("/active-sensors", async (req, res) => {
  try {
    const client = await connect();
    if (!client) {
      throw new Error("error to connect");
    } else {
      const db = client.db(dbName);
      let query = {
        uid: req.headers.uid,
      };
      let projection = {
        _id: 0,
        devicename: 1,
        inputValue: {
          $slice: ["$inputValue", -1],
        },
      };
      let value = await db
        .collection("sensors")
        .find(query, { projection })
        .toArray();
      let data = [];
      value.forEach((element) => {
        if (element.inputValue[0].temperature !== "temp_off") {
          data.push({
            devicename: element.devicename,
            sensor: "temperature",
          });
        }
        if (element.inputValue[0].humidity !== "humi_off") {
          data.push({
            devicename: element.devicename,
            sensor: "humidity",
          });
        }
        if (element.inputValue[0].analog !== "temp_off") {
          data.push({
            devicename: element.devicename,
            sensor: "analog",
          });
        }
      });
      res.status(200).send(data);
      client.close();
    }
  } catch (e) {
    return res.status(500).send({
      error_message: e.message,
    });
  }
});

module.exports = router;