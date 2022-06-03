const config = require("config");
const crypto = require("crypto");



module.exports = function() {
    if (!config.get("jwtPrivateKey")) {
        throw new Error("FATAL ERROR: jwtPrivateKey is not defined.");
    }
    //console.log("key ", config.get("jwtPrivateKey"));
}