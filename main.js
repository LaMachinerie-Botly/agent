const path = require('path')
const express = require('express');
const bodyParser = require("body-parser");
//const WindowsTrayicon = require("windows-trayicon");

var cors = require('cors');

var Agent = {};

Agent.basepath = process.cwd();

require('./app/arduino')(Agent);
require('./app/config')(Agent);
require('./app/log')(Agent);


const app = express();

app.use(cors());
app.use(bodyParser.urlencoded());

app.get('/', function (req, res) {
  res.send('root');
})

app.get('/info', function (req, res) {
  res.send('ok');
})

app.post('/upload', function (req, res) {
  //console.log(req);
  const fs = require('fs');
  var base64encoded = req.body.data;
  if (base64encoded != undefined) {
    code = Buffer.from(base64encoded, 'base64').toString('utf8');
    try { fs.writeFileSync(Agent.basepath + '/sketch/sketch.ino', code, 'utf-8'); } catch (e) {
      console.log('[Error] Failed to save the file : ');
      console.log(e);
      res.end("fail");
      return;
    }
  } else {
    console.log('[Error] Nothing received :')
    console.log(req.body);
    res.end("fail");
    return;
  }

  Agent.Arduino.compile(function (state) {
    if (state) {
      Agent.Arduino.upload(function (state) {
        if (state) res.end("sucess");
        else res.end('fail');
      });
    } else res.end('fail');
  });

})

app.listen(3000, function () {
  Agent.log("Botly Agent is starting...")
  
  const sp = require('child_process').spawn;
  sp(Agent.basepath  + "\\notifu.exe", ['/m', "Botly-Agent is running", "/i", Agent.basepath + "\\logo.ico", "/p", "Botly-Agent", "/q", "/c", "/e", "/w"], {windowsHide: true});

  Agent.Arduino.install();
})



