

const path = require('path')
const express = require('express');

var Agent = {};

Agent.basepath = path.resolve(__dirname);

require('./app/arduino')(Agent);
require('./app/config')(Agent);
require('./app/log')(Agent);

const app = express();

app.get('/', function (req, res) {
  res.send('root');
})

app.post('/upload', function (req, res) {
    res.send('root');
})

app.listen(3000, function () {
    Agent.log("Botly Agent is starting...")

    Agent.Arduino.install();
})