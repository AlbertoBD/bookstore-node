module.exports = function() {
    process.on("uncaughtException", err => {
        console.log("Uncaught Exception...", err.message, err);
        process.exit(1);
    });
    
    process.on("unhandledRejection", err => {
        console.log("Unhandled Rejection...", err.message, err);
        process.exit(1);
    });
}