var MongoClient = require('mongodb').MongoClient;
const { json } = require('body-parser');
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
     


        

            for (var i = 0, len = req.body.length; i < len; i++) {


                const myquery =  {
                    uid: req.headers.uid,
                   "devicename": req.body[i].devicename
               };

                var updateValue = {
                    $push: {
                        "inputValue": {
                            "temperature": req.body[i].temperature || "25.0",
                            "humidity": req.body[i].humidity || "50",
                            "light": req.body[i].light || "500",
                            "timestamp": req.body[i].timestamp || Math.floor(Date.now() / 1000).toString()
                        }
                    }
                };
    
    
                const newData = {
                    uid: req.headers.uid,
                    "devicename": req.body[i].devicename,
                    "D1": "false",
                    "D2": "false",
                    "D5": "false",
                    "D6": "0.0",
                    "automation": "false",
                    "data_chart": [{
                        "temperature": req.body[i].temperature || "25.0",
                        "humidity": req.body[i].humidity || "50",
                        "light": req.body[i].light || "500",
                        "timestamp": req.body[i].timestamp || Math.floor(Date.now() / 1000).toString()
                    }],
                    "inputValue": [{
                        "temperature": req.body[i].temperature || "25.0",
                        "humidity": req.body[i].humidity || "50",
                        "light": req.body[i].light || "500",
                        "timestamp": req.body[i].timestamp || Math.floor(Date.now() / 1000).toString()
                    }]
                }
    
    
                const allDevice = await sensorCollection.find(myquery).toArray();
    

                if (allDevice.length <= 0) {
                    console.log("index now is: " + i + "LENGTH is" + len )
                    sensorCollection.insertOne(newData)
                    if(i >= len){
                        res.status(200).send(true);
                    }
                } else {

                    sensorCollection.updateMany((myquery), updateValue, function (err, result) {
                        console.log("index now issss: " + i + "LENGTH is" + len )
                        if (err) {
                            console.log("ERRORSSSSSSSS: " + err)
                            throw err;
                        }else if(i == len){
                            res.status(200).send(true);
                        }
                        
                       

                    });

                }

            }





        }
    } catch (e) {

        console.log("GET IN CATCH: " + e)
        res.send("ERROR :" + e)
    }


}


router.post('/', async (req, res) => await getDeviceData(req, res));





module.exports = router;
