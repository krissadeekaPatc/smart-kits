const { connect,dbName } = require("../conn");
var express = require('express')
var router = express.Router();

async function addTokenFCM(){
    try{
        const client = connect();
        if(!client){
            throw new Error("Can not connect to database")
        }else{
            const db = client.db(dbName);
            let userCollection = db.collection("users")
        }
    }catch(e){

    }
}
router.post("/",(req,res)=>{

});