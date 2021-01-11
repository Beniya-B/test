const express = require("express");
const bodyParser = require("body-parser");
const api = require("./server/routes");
var fs = require('fs');
const InitiateMongoServer = require("./server/config/db");
let cors = require('cors');


// Initiate Mongo Server
InitiateMongoServer();

const app = express();

// PORT
const PORT = process.env.PORT || 4000;

// Middleware
app.use(bodyParser.json());
app.use(cors())

app.get("/", (req, res) => {
    res.json({ message: "API Working" });
});

app.use("/api", api);


app.listen(PORT, (req, res) => {
    console.log(`Server Started at PORT ${PORT}`);
});