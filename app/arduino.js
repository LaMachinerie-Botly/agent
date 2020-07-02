const { basename } = require('path');

module.exports = function(app) {

    var arduino = {}; 
    arduino.cli = app.basepath + 'arduino/arduino-cli.exe';

    arduino.checkInstall() = function () {

        const { spawn } = require('child_process');

        const child = spawn();

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

    arduino.install = function () {

    }

}
