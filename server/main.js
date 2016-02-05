"use strict";

const restify = require("restify");
const PORT = process.env.PORT || 5000;

const statuses = require("./data.json");

const server = restify.createServer({ name: "Traffic Control API" });

server.get("/api/flights", (req, res, next) => {
    res.send(statuses);
    next();
});

server.get(/.*/, restify.serveStatic({
    directory: "./web/static",
    default: "index.html"
}));

server.listen(PORT, (a, b) => {
    console.log(`${server.name} listening at ${server.url}`);
});
