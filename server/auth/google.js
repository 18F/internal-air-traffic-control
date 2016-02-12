"use strict";

const GoogleStrategy = require("passport-google-oauth20").Strategy;
const request = require("request");
const sheet = require("../sheet");

module.exports = {
    setupMiddleware: function(server, passport, errorURL) {
        passport.use(new GoogleStrategy({
            clientID: process.env["GOOG_CLIENT_ID"],
            clientSecret: process.env["GOOG_CLIENT_SECRET"],
            callbackURL: process.env["GOOG_CALLBACK_URL"]
        }, function(accessToken, refreshToken, profile, done) {
            sheet.getListFeedURL(accessToken)
                .then(() => done(null, { accessToken, refreshToken, expires: (Date.now() + (30 * 60 * 1000)), name: profile.displayName }))
                .catch(e => done(e, false));
        }));

        passport.serializeUser((user, done) => {
            done(null, JSON.stringify(user));
        });

        passport.deserializeUser((user, done) => {
            done(null, JSON.parse(user));
        });

        server.get("/auth/google", passport.authenticate("google", { accessType: "offline", prompt: "consent", scope: [ "profile", "https://spreadsheets.google.com/feeds", "https://www.googleapis.com/auth/drive" ] }));
        server.get("/auth/google/callback",
            passport.authenticate("google", { failureRedirect: errorURL }),
            (req, res) => {
                res.redirect("/");
            });
    },

    refresh: function(req) {
        return new Promise((resolve, reject) => {
            if(!req.user || !req.user.refreshToken) {
                return reject(new Error("No user or refresh token"));
            }

            if(req.user.expires > Date.now()) {
                resolve();
            } else {
                request.post("https://www.googleapis.com/oauth2/v4/token", {
                    form: {
                        "client_id": process.env["GOOG_CLIENT_ID"],
                        "client_secret": process.env["GOOG_CLIENT_SECRET"],
                        "refresh_token": req.user.refreshToken,
                        "grant_type": "refresh_token"
                    }
                }, function(err, res, body) {
                    if(err) {
                        return reject(err);
                    }

                    try {
                        body = JSON.parse(body);
                    } catch(e) {
                        return reject(new Error("Could not parse refreshed token body"));
                    }

                    if(body.error) {
                        return reject(new Error(body.error_description));
                    }

                    req.user.accessToken = body["access_token"];
                    req.user.expires = (Date.now() + (30 * 60 * 1000));
                    req.login(req.user, error => {
                        resolve();
                    });
                });
            }
        });
    }
};
