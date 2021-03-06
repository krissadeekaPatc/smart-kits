var MongoClient = require('mongodb').MongoClient;
const { json } = require('body-parser');
var express = require("express");
var router = express.Router();
const { connect, dbName } = require("../conn");


async function getDeviceData(req,res){
    try{
        const client = await connect();
        if(!client){
            return res.send("CANNOT CONNECT TO DATABASE");
        }else{
            const db = client.db(dbName);


            const myquery = {
                uid: req.headers.uid,
                "devicename": req.body.devicename
            };
            let sensorCollection = db.collection("sensors");
            const allDevice =  await sensorCollection.find(myquery).toArray();

            var updateValue = {
                $push: {
                    "inputValue": {
                        "temperature": req.body.temperature || "25.0",
                        "humidity": req.body.humidity || "50",
                        "light": req.body.light || "DISABLED",
                        "timestamp": req.body.timestamp || Math.floor(Date.now() / 1000).toString()
                    }
                }
            };


            const newData = {
                uid: req.headers.uid,
                "devicename": req.body.devicename,
                "inputValue": [{
                    "temperature": req.body.temperature || "25.0",
                    "humidity": req.body.humidity || "50",
                    "light": req.body.light || "DISABLED",
                    "timestamp": req.body.timestamp || Math.floor(Date.now() / 1000).toString()
                }]
            }
            
            if(allDevice.length <= 0){
                sensorCollection.insert(newData)
             
                res.send(true);
            }else{
         
                sensorCollection.updateMany(myquery, updateValue, function (err, result) {
                    if (err) throw err;
                    res.status(200).send(true)
                    client.close();
                });
                res.send(true);
            }
            

        }
    }catch(e){
       
        res.send("ERROR :" + e)
    }
    

}


router.post('/', async (req, res) => await getDeviceData(req,res));





module.exports = router;
