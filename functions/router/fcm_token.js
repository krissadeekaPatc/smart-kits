const { connect, dbName } = require("../conn");
var express = require("express");
var router = express.Router();

async function addTokenFCM(req, res) {
  try {
    const client = await connect();
    if (!client) {
      return res.send("CANNOT CONNECT TO DATABASE");
    } else {
      const db = client.db(dbName);

      let userCollection = db.collection("users");
      let projection = {
        _id: false,
        registrationTokens: true,
      };
      let query = {
        registrationTokens: {
          $in: [req.body.fcmtoken],
        },
      };

      let userToken = await userCollection
        .find(query, { projection })
        .toArray();

      var updateValue = {
        $push: {
          registrationTokens: req.body.fcmtoken,
        },
      };
      let myquery = {
        uid: req.headers.uid,
      };
      if (userToken.length < 1) {
        userCollection.updateMany(myquery, updateValue, function (err, result) {
          if (err) {
            console.log("ERRORSSSSSSSS: " + err);
            throw err;
          }
          res.status(200).send(true);
        });
      } else {
        res.status(400).send("Already added!");
      }
    }
  } catch (e) {
    console.log("GET IN CATCH: " + e);
    res.send("ERROR :" + e);
  }
}
router.patch("/", (req, res) => addTokenFCM(req, res));

module.exports = router;
