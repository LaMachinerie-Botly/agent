module.exports = function (app) {

    const fs = require('fs');
    var arduino = {};
    arduino.cli = {}

    arduino.cli.path = app.basepath + '/arduino/arduino-cli.exe';

    arduino.cli.spawn = function (params, cb) {
        const spawn = require('child_process').spawnSync;

        var result = spawn(arduino.cli.path, params);
        if (result.stderr != "") {
            console.error('[Arduino-cli] ' + params + ': failed -> ' + result.stderr);
            if (cb instanceof Function) cb(false);
        } else {
            console.log('[Arduino-cli] ' + params + ': done.')
            if (cb instanceof Function) cb(true);
        }
    }

    arduino.install = function () {
        const path = require('path');
        var fs = require('fs');

        var docPath = path.join(process.env.USERPROFILE, 'Documents');
        var ArdPath = path.join(docPath, 'Arduino');
        var libPath = path.join(ArdPath, 'libraries');

        if (!fs.existsSync(ArdPath)) fs.mkdirSync(ArdPath);
        if (!fs.existsSync(libPath)) fs.mkdirSync(libPath);

        arduino.updateCore(arduino.installCore);
        arduino.installLib_IRremote();
        arduino.installLib_Servo();
        arduino.installLib_Botly();

        arduino.sketch();
    }

    arduino.testProgramm = function(){
        
        var code = "#include <Botly.h>\n";
        code += "Botly robot;\n";
        code += "void setup(){ robot.init();}\n";
        code += "void loop(){robot.avancer(10);}";


        try { fs.writeFileSync(app.basepath + '/sketch/sketch.ino', code, 'utf-8'); } catch (e) {
            console.log('[Error] Failed to save the file : ');
            console.log(e);
            res.end("fail");
            return;
          }

        arduino.compile(function (state) {
            if (state) {
                console.log("Compiled sucessfully");
                arduino.upload(function (state) {
                    if (state) console.log("Uploaded sucessfully");
                    else console.log('Upload failed');
                });
            }
            else console.log('Failed compilation');
        });
    }
    
    arduino.sketch = function (cb) {
        arduino.cli.spawn(['sketch', 'new', 'sketch']);
        arduino.cli.spawn(["board", "attach", "arduino:avr:LilyPadUSB"], cb)
    }

    arduino.save = function (base64encoded) {
        var code = "void setup() {pinMode(13, OUTPUT);}void loop() {digitalWrite(13, HIGH);delay(1000);digitalWrite(13, LOW);delay(1000);}";

        if (base64encoded != undefined) {
            code = Buffer.from(base64encoded, 'base64').toString('utf8');
            try { fs.writeFileSync(basepath + '/sketch/sketch.ino', code, 'utf-8'); } catch (e) {
                log('[Error] Failed to save the file : ');
                log(e);
                res.end("fail");
                return;
            }
        }
    }

    arduino.compile = function (cb) {
        arduino.cli.spawn(['compile', '--fqbn', 'arduino:avr:LilyPadUSB', 'sketch'], cb);
    }

    arduino.upload = function (cb) {
        var port = arduino.autoSelectPort();
        console.log(port);
        
        if (port == "") console.log("No port");
        arduino.cli.spawn(['upload', '-p', port, '--fqbn', 'arduino:avr:LilyPadUSB', 'sketch'], cb);
    }

    arduino.autoSelectPort = function () {
        const spawn = require('child_process').spawnSync;

        var port = "";

        var result = spawn(arduino.cli.path, ['board', 'list']);
        if (result.stderr != "") {
            console.error('[Arduino-cli] ' + ': failed -> ' + result.stderr);
            if (cb instanceof Function) cb(false);
        } else {
            var out = "";
            out += result.stdout;
            var lines = out.split('\n');
            lines.shift();
            boards = [];
            board = {};
            lines.forEach(line => {
                if (line.includes('arduino:avr:LilyPadUSB')){
                    console.log(line);
                    port = line.split(' ')[0];
                    console.log(port);
                }
            });
        }
        return port;
    }

    arduino.updateCore = function (cb) {
        arduino.cli.spawn(['core', 'update-index'], cb);
    }

    arduino.installCore = function (cb) {
        arduino.cli.spawn(['core', 'install', 'arduino:avr'], cb);
    }

    arduino.installLib_IRremote = function () {
        arduino.cli.spawn(['lib', 'install', 'IRremote']);
    }

    arduino.installLib_Servo = function () {
        arduino.cli.spawn(['lib', 'install', 'Servo']);
    }

    function download(url, dest) {

        var request = require('sync-request');
        var content = request('GET', url);
        fs.writeFileSync(dest, content.getBody());
        console.log("[Botly-Library] download complete.")
    }


    arduino.installLib_Botly = function () {

        var docPath = process.env.USERPROFILE + '\\Documents\\Arduino\\libraries';

        try {
            if (fs.existsSync(docPath + '\\Botly-Library\\library.properties')) {
                console.log('[Arduino-cli] Botly-Library already installed');
                return;
            }
        } catch (err) {
            console.error(err)
        }

        console.log("[Botly-Library] : Installing Botly-Library...");
        var url = "https://github.com/Botly-Studio/Botly-Library/releases/download/Strawberries/Botly-Library.zip"

        var filename = "Botly-Library.zip"

        console.log("[Botly-Library] : downloading...");
        download(url, docPath + "\\" + filename);

        const extract = require('extract-zip');
        console.log("[Botly-Library] : extracting...");
        try {
            extract(docPath + '\\Botly-Library.zip', { dir: docPath + "\\Botly-Library" });
            console.log("[Botly-Library] : Extraction complete");
        } catch (err) {
            if (err) {
                console.error(err);
                return;
            }
        }

    }


    app.Arduino = arduino;
}
