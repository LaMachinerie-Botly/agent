
module.exports = function(app){
    app.config = {
        port: 80,
        log: true,
        origins: [
            'http://botly-studio.fr',
            'http://localhost:8080'
        ]
    }
};
