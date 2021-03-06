var MongoClient = require("mongodb").MongoClient;
var express = require("express");
const { Server } = require("mongodb");
var router = express.Router();
const { connect, dbName } = require("../conn");



async function test1(req,res){
const client = await connect();

      const dbo = client.db(dbName);

    if (!client) {
      res.send("SORRY CANNOT CONNECT TO DATABASE");
    } else {
      try {
        
        var query = {
          uid: req.headers.uid,
        };
        var query2 = {
          uid: req.headers.uid,
          devicename: req.headers.devicename,
        };
        if(req.headers.devicename){
          dbo
          .collection("sensors")
          .find(query2)
          .toArray(function (err, result) {
            if (query.uid == undefined) {
              res.send("Error");
            }
            res.send(result);
          });
        }else{
          dbo
          .collection("sensors")
          .find(query)
          .toArray(function (err, result) {
            if (query.uid == undefined) {
              res.send("Error");
            }
            res.status(200).send(result);
          });
        }
      


      } catch (e) {
        res.send(e);
      } finally {
          client.close();
      }
    }
}


router.get("/all", (req, res) => test1(req,res));


  
//Get All
router.get("/", (req, res) => test1(req,res));

//Get Last
router.get("/last", (req, res) => {
  const url =
    "mongodb+srv://admin:1234@cluster0.z5vrr.mongodb.net/project_api?retryWrites=true&w=majority";
  const dbName = "project_api";
  MongoClient.connect(url, function (err, client) {
    var dbo = client.db(dbName);
    var query = {
      uid: req.headers.uid,
    };
    dbo
      .collection("sensors")
      .find(query)
      .toArray(function (err, result) {
        if (query.uid == undefined) {
          res.send("Error");
        }
        res.send([result[0].inputValue[result[0].inputValue.length - 1]]);
        client.close();
      });
  });
});

router.get("/chart", (req, res) => {
  const url =
    "mongodb+srv://admin:1234@cluster0.z5vrr.mongodb.net/project_api?retryWrites=true&w=majority";
  const dbName = "project_api";
  MongoClient.connect(url, function (err, client) {
    var dbo = client.db(dbName);
    var query = {
      uid: req.headers.uid,
      devicename: req.headers.devicename,
    };
    dbo
      .collection("sensors")
      .find(query)
      .toArray(function (err, result) {
        if (query.uid == undefined) {
          res.send("Error");
        }

        var chart =
          result[0].data_chart.length >= 6
            ? result[0].data_chart.slice(
                Math.max(result[0].data_chart.length - 6)
              )
            : result[0].data_chart;
        res.send(chart);
        client.close();
      });
  });
});

router.post("/chart", (req, res) => {
  const url =
    "mongodb+srv://admin:1234@cluster0.z5vrr.mongodb.net/project_api?retryWrites=true&w=majority";
  const dbName = "project_api";
  MongoClient.connect(url, function (err, client) {
    var dbo = client.db(dbName);
    var myquery = {
      uid: req.headers.uid,
      devicename: req.headers.devicename,
    };
    var newvalues = {
      $push: {
        data_chart: {
          temperature:
            req.body.temperature || "25.0",
            humidity: req.body.humidity || "50",
            light: req.body.light ||"DISABLED",
            timestamp:
            req.body.timestamp || Math.floor(Date.now() / 1000).toString(),
        },
      },
    };
    dbo
      .collection("sensors")
      .updateMany(myquery, newvalues, function (err, result) {
        if (err) throw err;
        res.status(200).send(true);
        client.close();
      });
  });
});

module.exports = router;
// let data = JSON.stringify(result)
// const mpa1 = result.map(item=>item.users.devices.devicename)
