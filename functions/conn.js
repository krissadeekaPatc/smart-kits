const functions = require('firebase-functions');
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
var express = require("express");
const DB_URL= 'mongodb+srv://admin:1234@cluster0.z5vrr.mongodb.net/project_api?retryWrites=true&w=majority';
const dbName = 'project_api';


async function connect() {
    try {
        if (MongoClient && MongoClient.prototype.isConnected()) {
            console.log("CONNECTED")
            return MongoClient;
        }
       const  client = await MongoClient.connect(DB_URL, {
            useNewUrlParser: true,
        }
     
         ).catch((err) => {
            console.log("Error 1: " + err.message);
            return null;
        })
        return client;
    } catch (error) {
        console.log("Error 2: " + error.message);
        return null;
    }
}


module.exports = {connect,dbName}
