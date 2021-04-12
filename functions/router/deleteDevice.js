const express = require("express");
const router = express.Router();
const { connect, dbName } = require("../conn");

router.delete("/", async (req, res) => {
  try {
    const client = await connect();
    if (!client) {
      throw new Error("error to connect");
    } else {
      const db = client.db(dbName);
      let query = {
        uid: req.headers.uid,
        devicename: req.headers.dname,
      };
      await db.collection("sensors").deleteOne(query, function (err, obj) {
        if (err) throw err;
        res.status(200).send(true);
        client.close();
      });
    }
  } catch (e) {
    return res.status(500).send(e.message);
  }
});

module.exports = router;
