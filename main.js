

const path = require('path')
const express = require('express');

var Agent = {};

Agent.basepath = path.resolve(__dirname);

const config = require('.app/config')(Agent);
const arduino = require('./app/arduino')(Agent);


const app = express();

function log(msg) {
    if(config.log)
        console.log(msg);
}

function warn(msg) {
    if(config.log)
        console.warn(msg);
}




app.get('/', function (req, res) {
  res.send('root');
})

app.post('/upload', function (req, res) {
    res.send('root');
})

app.listen(3000, function () {
    log("Botly Agent is running !")
})