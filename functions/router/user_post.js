var MongoClient = require("mongodb").MongoClient;
var express = require("express");
var router = express.Router();
var { connect, dbName } = require("../conn");

async function createUniqueName(req, res) {
  try {
    const client = await connect();
    if (!client) {
      return res.send("CANNOT CONNECT TO DATABASE");
    } else {
      const db = client.db(dbName);

      let usersCollection = db.collection("users");

      const myQuery1 = {
        uid: req.headers.uid,
      };

      const myQuery = {
        uniqueName: req.body.uniqueName,
      };

      var newvalues = {
        $set: { uniqueName: req.body.uniqueName },
      };

      const user = await usersCollection.find(myQuery).toArray();
      if (user.length <= 0) {
        // res.send(user);
        usersCollection.updateMany(myQuery1, newvalues, function (err, result) {
          if (err) {
            res.send(err);
          }

          res.status(200).send(result);
        });
      } else {
        // res.send("TEST PASS");
        res.status(500).send("Already use this Unique Name");
      }
    }
  } catch (e) {
    res.status(500).send(e);
  }
}

router.patch("/create_unique_name", (req, res) => createUniqueName(req, res));

router.post("/", (req, res) => {
  const url =
    "mongodb+srv://admin:1234@cluster0.z5vrr.mongodb.net/project_api?retryWrites=true&w=majority";
  const dbName = "project_api";
  MongoClient.connect(url, async function (err, client) {
    if (err) throw err;
    var dbo = client.db(dbName);
    var myobj = {
      uid: req.body.uid,
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      uniqueName: req.body.uniqueName,
      // registrationTokens: [],
    };
    const myQuery = {
      uid: req.body.uid,
    };
    const user = await dbo.collection("users").find(myQuery).toArray();
    if (user.length <= 0) {
      // res.send(user);
      dbo.collection("users").insertOne(myobj, function (err, result) {
        if (err) {
          res.send(err);
        }

        res.status(200).send(result);
      });
    } else {
      // res.send("TEST PASS");
      res.status(500).send("Already use this UID");
    }
  });
});
module.exports = router;
