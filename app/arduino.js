const { basename } = require('path');
const { json } = require('body-parser');

module.exports = function (app) {

    const { spawn } = require('child_process');

    var arduino = {};
    arduino.cli = app.basepath + '/arduino/arduino-cli.exe';

    arduino.install = function () {
        arduino.installCore();
        arduino.installLib_IRremote();
        arduino.installLib_Servo();
        arduino.installLib_Botly();
        arduino.sketch();
    }

    arduino.sketch = function () {
        const child = spawn(arduino.cli, ['sketch', 'new', 'sketch']);

        child.on('exit', function (code, signal) {
            console.log('child process exited with ' +
                `code ${code} and signal ${signal}`);
        });

        child.stdout.on('data', (data) => {
            console.log(`child stdout:\n${data}`);
        });

        child.stderr.on('data', (data) => {
            console.error(`child stderr:\n${data}`);
        });
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

    arduino.compile = function (code) {

        const fs = require('fs');

        const child = spawn(arduino.cli, ['upload', '--fqbn', 'arduino:avr:LilyPadUSB', '--build-path', '/opt/lillypizza/build', 'sketch']);

        child.on('exit', function (code, signal) {
            console.log('child process exited with ' +
                `code ${code} and signal ${signal}`);
        });

        child.stdout.on('data', (data) => {
            console.log(`child stdout:\n${data}`);
        });

        child.stderr.on('data', (data) => {
            console.error(`child stderr:\n${data}`);
        });

    }

    arduino.installCore = function () {

        const child = spawn(arduino.cli, ['core', 'install', 'arduino:avr']);

        child.on('exit', function (code, signal) {
            console.log('child process exited with ' +
                `code ${code} and signal ${signal}`);
        });

        child.stdout.on('data', (data) => {
            console.log(`child stdout:\n${data}`);
        });

        child.stderr.on('data', (data) => {
            console.error(`child stderr:\n${data}`);
        });
    }

    arduino.installLib_IRremote = function () {

        const child = spawn(arduino.cli, ['lib', 'install', 'IRremote']);

        child.on('exit', function (code, signal) {
            console.log('child process exited with ' +
                `code ${code} and signal ${signal}`);
        });

        child.stdout.on('data', (data) => {
            console.log(`child stdout:\n${data}`);
        });

        child.stderr.on('data', (data) => {
            console.error(`child stderr:\n${data}`);
        });
    }


    arduino.installLib_Servo = function () {

        const child = spawn(arduino.cli, ['lib', 'install', 'Servo']);

        child.on('exit', function (code, signal) {
            console.log('child process exited with ' +
                `code ${code} and signal ${signal}`);
        });

        child.stdout.on('data', (data) => {
            console.log(`child stdout:\n${data}`);
        });

        child.stderr.on('data', (data) => {
            console.error(`child stderr:\n${data}`);
        });
    }

    arduino.installLib_Botly = function () {

        console.log("Installing Botly-Library...");
        const fs = require('fs')

        var docPath = process.env.USERPROFILE + '\\Documents\\Arduino\\libraries';

        try {
            if (fs.existsSync(docPath + '\\Botly-Library\\library.json')) {
                var raw = fs.readFileSync(docPath + '\\Botly-Library\\library.json');
                json = JSON.parse(raw);
                if (json.version == "2.1.0")
                    return;
            }
        } catch (err) {
            console.error(err)
        }


        var download = require('download-file')

        var url = "https://github.com/Botly-Studio/Botly-Library/archive/master.zip"

        var options = {
            directory: docPath,
            filename: "Botly-Library.zip"
        }

        download(url, options, function (err) {
            if (err) throw err
            console.log("Zip successfully downloaded !")
        })


        const extract = require('extract-zip')

        try {
            await extract(source, { dir: target })
            console.log('Extraction complete')
        } catch (err) {
            // handle any errors
        }


    }


    app.Arduino = arduino;
}
