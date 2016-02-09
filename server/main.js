"use strict";

const restify = require("restify");
const passport = require("passport");
const sessions = require("client-sessions");
const PORT = process.env.PORT || 5000;
const statuses = require("./data.json");

if(!process.env["GH_CLIENT_ID"]) {
    console.error("GitHub client ID not set.  Cannot continue.");
    process.exit(1);
}
if(!process.env["GH_CLIENT_SECRET"]) {
    console.error("GitHub client secret not set.  Cannot continue.");
    process.exit(1);
}
if(!process.env["GH_CALLBACK_URL"]) {
    console.error("GitHub callback URL not set.  Cannot continue.");
    process.exit(1);
}

if(!process.env["SESSION_SECRET"]) {
    console.warn("No SESSION_SECRET set.  Using less secure default.");
}

const server = restify.createServer({ name: "Traffic Control API" });
server.use(sessions({
    cookieName: "session",
    secret: process.env["SESSION_SECRET"] || "N4JnqJmmMjjEHHq22yIAkN0owlsMVJeYzsgBkSQ0zSPGrHmdxLVLfnFYGhccog7",
    duration: 24 * 60 * 60 * 1000, // how long the session will stay valid in ms
    activeDuration: 1000 * 60 * 5 // if expiresIn < activeDuration, the session will be extended by activeDuration milliseconds
}));

server.use(require("restify-redirect")());
server.use(restify.queryParser());
server.use(passport.initialize());
server.use(passport.session());

server.get('/auth/error', (req, res, next) => {
    return next(new restify.UnauthorizedError(""));
});

require("./auth/github")(server, passport, "/auth/error");

server.get("/api/flights", (req, res, next) => {
    if(req.user) {
        res.send(statuses);
    } else {
        res.send(new restify.UnauthorizedError("Not logged in"));
    }
    next();
});

server.get("/api/user", (req, res, next) => {
    const user = { loggedIn: false };
    if(req.user) {
        user.loggedIn = true;
        user.user = req.user;
    }
    res.send(user);
    next();
});

server.get(/.*/, restify.serveStatic({
    directory: "./web/static",
    default: "index.html"
}));

server.listen(PORT, (a, b) => {
    console.log(`${server.name} listening at ${server.url}`);
});
