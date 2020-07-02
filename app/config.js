
module.exports = function(app){
    app.config = {
        port: 80,
        log: true,
        origins: [
            'http://botly-studio.fr',
            'http://localhost:8080'
        ],
        compileArgs: ['compile', '--fqbn', 'arduino:avr:LilyPadUSB', '--build-path', '/opt/lillypizza/build', 'sketch']
    }
};
