

const path = require('path')
const express = require('express');
const bodyParser = require("body-parser");
const arduino = require('./app/arduino');

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
  var base64encoded = req.body.data;
  if (base64encoded != undefined) {
    code = Buffer.from(base64encoded, 'base64').toString('utf8');
    try { fs.writeFileSync(basepath + '/sketch/sketch.ino', code, 'utf-8'); } catch (e) {
      log('[Error] Failed to save the file : ');
      log(e);
      res.end("fail");
      return;
    }
  } else {
    log('[Error] Nothing received :')
    log(req.body);
    res.end("fail");
    return;
  }

  app.Arduino.compile(function(state){
    if (state) {
      app.Arduino.upload(function(state) {
        if(state) res.end("sucess");
        else res.end('fail');
      });
    }else res.end('fail');
  });

})

app.listen(3000, function () {
  Agent.log("Botly Agent is starting...")

  Agent.Arduino.install();
})