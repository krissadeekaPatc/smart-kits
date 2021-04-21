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
      let usersCollection = db.collection("users");

      const userQuery = {
        // uid: req.headers.uid,
        uniqueName: req.headers.uniqueName,
      };
      const users = await usersCollection.find(userQuery).toArray();
      console.log(users);

      req.body.forEach(async (element) => {
        console.log("Users From Test");
        console.log(users);
        const myquery = {
          uid: req.headers.uid,
          devicename: element.devicename,
        };

        var updateValue = {
          $push: {
            inputValue: {
              temperature: element.temperature || "25.0",
              humidity: element.humidity || "50",
              analog: element.analog || "500",
              timestamp:
                element.timestamp || Math.floor(Date.now() / 1000).toString(),
            },
          },
        };
        const newData = {
          uid: req.headers.uid,
          uniqueName: req.headers.uname,
          devicename: element.devicename,
          isLight: "true",
          automations: [
            {
              module: "switch1",
              action: "false",
              end_time: "null",
              mode: "กำหนดเอง",
              node_target: "null",
              operator: "null",
              sensor_target: "null",
              str_time: "null",
              value: "null",
            },
            {
              module: "switch2",
              action: "false",
              end_time: "null",
              mode: "กำหนดเอง",
              node_target: "null",
              operator: "null",
              sensor_target: "null",
              str_time: "null",
              value: "null",
            },
            {
              module: "pwm",
              action: "0",
              end_time: "null",
              mode: "กำหนดเอง",
              node_target: "null",
              operator: "null",
              sensor_target: "null",
              str_time: "null",
              value: "null",
            },
          ],
          data_chart: [
            {
              temperature: element.temperature || "25.0",
              humidity: element.humidity || "50",
              analog: element.analog || "500",
              timestamp:
                element.timestamp || Math.floor(Date.now() / 1000).toString(),
            },
          ],
          inputValue: [
            {
              temperature: element.temperature || "25.0",
              humidity: element.humidity || "50",
              analog: element.analog || "500",
              timestamp:
                element.timestamp || Math.floor(Date.now() / 1000).toString(),
            },
          ],
        };

        const allDevice = await sensorCollection.find(myquery).toArray();

        if (allDevice.length <= 0) {
          await sensorCollection.insertOne(newData);
        } else {
          await sensorCollection.updateMany(
            myquery,
            updateValue,
            function (err, result) {
              if (err) {
                console.log("ERRORSSSSSSSS: " + err);
                throw err;
              }
            }
          );
        }
      });

      res.status(200).send(true);
    }
  } catch (e) {
    console.log("GET IN CATCH: " + e);
    res.send("ERROR :" + e);
  }
}

router.post("/", async (req, res) => await getDeviceData(req, res));

async function sendDataChart(req, res) {
  try {
    const client = await connect();
    if (!client) {
      return res.send("CANNOT CONNECT TO DATABASE");
    } else {
      const db = client.db(dbName);

      let sensorCollection = db.collection("sensors");

      req.body.forEach(async (element) => {
        const myquery = {
          uid: req.headers.uid,
          devicename: element.devicename,
        };
        var newvalues = {
          $push: {
            data_chart: {
              temperature: element.temperature || "25.0",
              humidity: element.humidity || "50",
              analog: element.analog || "DISABLED",
              timestamp:
                element.timestamp || Math.floor(Date.now() / 1000).toString(),
            },
          },
        };

        await sensorCollection.updateMany(
          myquery,
          newvalues,
          function (err, result) {
            if (err) throw err;
          }
        );
      });

      res.status(200).send(true);
    }
  } catch (e) {
    console.log("GET IN CATCH: " + e);
    res.send("ERROR :" + e);
  }
}

router.post("/chart", async (req, res) => await sendDataChart(req, res));

async function toggleLight(req, res) {
  try {
    const client = await connect();
    if (!client) {
      return res.send("CANNOT CONNECT TO DATABASE");
    } else {
      const db = client.db(dbName);

      let sensorCollection = db.collection("sensors");

      const myquery = {
        uid: req.headers.uid,
        devicename: req.headers.devicename,
      };
      var newvalues = {
        $set: {
          isLight: req.body.isLight,
        },
      };

      sensorCollection.updateMany(myquery, newvalues, function (err, result) {
        if (err) throw err;
        res.status(200).send(result);
      });
    }
  } catch (e) {
    console.log("GET IN CATCH: " + e);
    res.send("ERROR :" + e);
  }
}

router.patch("/toggleLight", async (req, res) => await toggleLight(req, res));
module.exports = router;
