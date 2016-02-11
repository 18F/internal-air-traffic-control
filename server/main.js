"use strict";

const restify = require("restify");
const passport = require("passport");
const googleAuth = require("./auth/google");
const sessions = require("client-sessions");
const sheet = require("./sheet");
const PORT = process.env.PORT || 5000;

if(!process.env["GOOG_CLIENT_ID"]) {
    console.error("Google client ID not set.  Cannot continue.");
    process.exit(1);
}
if(!process.env["GOOG_CLIENT_SECRET"]) {
    console.error("Google client secret not set.  Cannot continue.");
    process.exit(1);
}
if(!process.env["GOOG_CALLBACK_URL"]) {
    console.error("Google callback URL not set.  Cannot continue.");
    process.exit(1);
}

if(!process.env["GOOG_SHEET_ID"]) {
    console.error("Google sheet ID not set.  Cannot continue.");
    process.exit(1);
}

if(!process.env["SESSION_SECRET"]) {
    console.warn("No SESSION_SECRET set.  Using less secure default.");
}

sheet.setSheetID(process.env["GOOG_SHEET_ID"])

const server = restify.createServer({ name: "Traffic Control API" });
server.use(sessions({
    cookieName: "session",
    secret: process.env["SESSION_SECRET"] || "N4JnqJmmMjjEHHq22yIAkN0owlsMVJeYzsgBkSQ0zSPGrHmdxLVLfnFYGhccog7",
    duration: 24 * 60 * 60 * 1000, // how long the session will stay valid in ms
    activeDuration: 1000 * 60 * 5, // if expiresIn < activeDuration, the session will be extended by activeDuration milliseconds
    cookie: {
        httpOnly: true
    }
}));

server.use(require("restify-redirect")());
server.use(restify.queryParser());
server.use(passport.initialize());
server.use(passport.session());

server.get('/auth/error', (req, res, next) => {
    return next(new restify.UnauthorizedError(""));
});

googleAuth.setupMiddleware(server, passport, "/auth/error");

server.use((req, res, next) => {
    if(!req.user) {
        res.redirect("/auth/google");
        next();
    } else {
        googleAuth.refresh(req)
            .then(next)
            .catch(e => {
                console.log("Error refreshing Google OAuth token");
                console.error(e);
                return next(new restify.InternalServerError("Could not refresh authentication token"));
            });
    }
});

server.get("/api/flights", (req, res, next) => {
    sheet.getRows(req.user.accessToken)
        .then(rows => {
            for(let r of rows) {
                switch(r.lead.toLowerCase()) {
                    case "none":
                    case "tbd":
                        r.lead = "";
                        break;
                }
                switch(r.pair.toLowerCase()) {
                    case "none":
                    case "tbd":
                        r.pair = "";
                        break;
                }

                r.staff = [ ];
                if(r.staff3.length) {
                    r.staff.push(r.staff3);
                }
                if(r.staff4.length) {
                    r.staff.push(r.staff4);
                }
                delete r.staff3;
                delete r.staff4;
            }
            res.send(rows);
        })
        .catch(e => {
            console.log("Error getting rows from sheet:");
            console.log(e);
            res.send(new restify.InternalServerError());
        });
    next();
});

server.get("/api/user", (req, res, next) => {
    res.send({ loggedIn: true, user: { name: req.user.name } });
    next();
});

server.get(/.*/, restify.serveStatic({
    directory: "./web/static",
    default: "index.html"
}));

server.listen(PORT, (a, b) => {
    console.log(`${server.name} listening at ${server.url}`);
});
