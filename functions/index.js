const functions = require("firebase-functions");
var express = require("express");
var cors = require("cors");
var app = express();
app.set("view engine", "ejs");
app.use(cors());
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const admin = require("firebase-admin");
var serviceAccount = require("./permission.json");
const Middleware = require("./Middleware");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://smartfarmkits-default-rtdb.firebaseio.com",
});

const port = 443;
app.listen(port, () => console.log(`Listening on port${port}...`));

var sensorget = require("./router/sensor_get");
app.use("/sensorget", sensorget);

var userget = require("./router/user_get");
app.use("/userget", userget);

var userpost = require("./router/user_post");
app.use("/userpost", userpost);

var update_value = require("./router/update_value");
app.use("/update_value", update_value);

var control = require("./router/control");
app.use("/control", control);

var notifications = require("./router/notifications");
app.use("/notifications", notifications);

var getcontrol = require("./router/getcontrol");
app.use("/getcontrol", getcontrol);

var automation = require("./router/automation");
app.use("/auto", automation);

var uniqueNameCheck = require("./router/uniqueNameCheck");
app.use("/uname", uniqueNameCheck);

var deleteDevice = require("./router/deleteDevice");
app.use("/delete_device", deleteDevice);

var fcmCheck = require("./router/fcm_token");
app.use("/fcm_check", fcmCheck);
