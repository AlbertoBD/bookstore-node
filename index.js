const express = require("express");
const app = express();

require("./startup/routes")(app);
require("./startup/db")();
require("./startup/logging")();
require("./startup/configuration")();


if (app.get("env") === "development") {
    console.log("Morgan enabled...");
}


const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
    console.log("Server started on port... " + port);
});

module.exports = server