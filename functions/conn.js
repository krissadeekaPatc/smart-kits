
const MongoClient = require('mongodb').MongoClient;
const DB_URL= 'mongodb+srv://admin:1234@cluster0.z5vrr.mongodb.net/project_api?retryWrites=true&w=majority';
const dbName = 'project_api';
let client   ;
async function connect() {
    try {
        if (client && client.isConnected()) {
            console.log("CONNEXT")
            return client;
        }
        
        client = await MongoClient.connect(DB_URL, {
            useNewUrlParser: true,
        }).catch((err) => {
            console.log("Error : " + err.message);
            return null;
        })
        return client;
    } catch (error) {
        console.log("Error : " + error.message);
        return null;
    }
}


module.exports = {connect,dbName}
