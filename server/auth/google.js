"use strict";

const OAuth2Strategy = require("passport-oauth2").Strategy;
const sheet = require("../sheet");

module.exports = function(server, passport, errorURL) {
    passport.use(new OAuth2Strategy({
        authorizationURL: "https://accounts.google.com/o/oauth2/v2/auth",
        tokenURL: "https://www.googleapis.com/oauth2/v4/token",
        clientID: process.env["GOOG_CLIENT_ID"],
        clientSecret: process.env["GOOG_CLIENT_SECRET"],
        callbackURL: process.env["GOOG_CALLBACK_URL"]
    }, function(accessToken, refreshToken, profile, done) {
        sheet.setAccessToken(accessToken);
        sheet.load()
            .then(() => done(null, { accessToken, name: "Google User "}))
            .catch(e => done(e, false));
    }));

    passport.serializeUser((user, done) => {
        done(null, JSON.stringify(user));
    });

    passport.deserializeUser((user, done) => {
        done(null, JSON.parse(user));
    });

    server.get("/auth/google", passport.authenticate("oauth2", { scope: [ "https://spreadsheets.google.com/feeds", "https://www.googleapis.com/auth/drive" ] }));
    server.get("/auth/google/callback",
        passport.authenticate("oauth2", { failureRedirect: errorURL }),
        (req, res) => {
            res.redirect("/");
        });
};
