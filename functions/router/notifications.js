var MongoClient = require("mongodb").MongoClient;
const { json } = require("body-parser");
const shortid = require("shortid");
var express = require("express");
var router = express.Router();
const admin = require("firebase-admin");
const { connect, dbName } = require("../conn");

router.post("/", (req, res) => {
  const url =
    "mongodb+srv://admin:1234@cluster0.z5vrr.mongodb.net/project_api?retryWrites=true&w=majority";
  const dbName = "project_api";
  MongoClient.connect(url, function (err, client) {
    if (err) throw err;
    var dbo = client.db(dbName);
    var query = { uid: req.headers.uid };
    var newvalues = {
      $push: {
        notification: {
          title: req.body.title,
          body: req.body.message,
          nID: shortid.generate(),
          timestamp:
            req.body.timestamp || Math.floor(Date.now() / 1000).toString(),
        },
      },
    };

    dbo
      .collection("users")
      .find(query)
      .toArray(async function (err, result) {
        if (err) throw err;
        const tokens = result[0];
        const tokensList = Object.values(tokens.registrationTokens);

        let payload = {
          notification: {
            title: req.body.title,
            body: req.body.message,
            sound: "default",
          },
        };
        admin.messaging().sendToDevice(tokensList, payload);
        await dbo
          .collection("notification")
          .updateMany(query, newvalues, function (err, result) {
            if (err) throw err;
          });

        res.send("SENT!😤😤😤😤");
      });
  });
});

router.get("/", async (req, res) => {
  const client = await connect();
  const dbo = client.db(dbName);
  if (!client) {
    res.send("SORRY CANNOT CONNECT TO DATABASE");
  } else {
    try {
      let projection = {
        _id: false,
        uid: false,
      };
      var query = {
        uid: req.headers.uid,
      };
      dbo
        .collection("notification")
        .find(query, { projection })
        .toArray(function (err, result) {
          if (err) throw err;
          res.send(result);
          client.close();
        });
    } catch (e) {
      res.send(e);
    }
  }
});

async function deleteNotification(req, res) {
  try {
    const client = await connect();
    if (!client) {
      return res.send("CANNOT CONNECT TO DATABASE");
    } else {
      const db = client.db(dbName);

      let userCollection = db.collection("notification");
      let query = {
        uid: req.headers.uid,
      };
      let value = {
        $pull: { notification: { nID: req.body.nID } },
      };
      userCollection.updateOne(query, value, function (err, result) {
        if (err) throw err;
        if (result) {
          res.status(200).send(result);
        }
      });
    }
  } catch (e) {
    console.log("GET IN CATCH: " + e);
    res.send("ERROR :" + e);
  }
}

router.patch("/delete", (req, res) => deleteNotification(req, res));

module.exports = router;
