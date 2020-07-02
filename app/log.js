module.exports = function(app){
    app.warn = function(msg) {
        console.warn(msg);
    }

    app.info = function(msg) {
        console.info(msg);
    }

    app.log = function(msg){
        console.log(msg);
    }
}