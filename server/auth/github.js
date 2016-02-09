"use strict";

const GithubStrategy = require("passport-github").Strategy;
const request = require("request");

module.exports = function(server, passport, errorURL) {
    passport.use(new GithubStrategy({
        clientID: process.env["GH_CLIENT_ID"],
        clientSecret: process.env["GH_CLIENT_SECRET"],
        callbackURL: process.env["GH_CALLBACK_URL"]
    }, function(accessToken, refreshToken, profile, done) {
        if(profile._json.organizations_url) {
            request.get(profile._json.organizations_url, { headers: { "User-Agent": "18F ATC", "Authorization": `token ${accessToken}` }}, (err, response, body) => {
                if(err) {
                    return done(err, false);
                }

                try {
                    body = JSON.parse(body);
                } catch(e) { };

                for(let org of body) {
                    if(org.login === "18F") {
                        return done(null, { accessToken, name: profile.displayName });
                    }
                }
                return done(new Error("Didn't find 18F org"), false);
            });
        } else {
            done(new Error("No organizations"), false);
        }
    }));

    passport.serializeUser((user, done) => {
        done(null, JSON.stringify(user));
    });

    passport.deserializeUser((user, done) => {
        done(null, JSON.parse(user));
    });

    server.get("/auth/github", passport.authenticate("github", { scope: "read:org" }));
    server.get("/auth/github/callback",
        passport.authenticate("github", { failureRedirect: errorURL }),
        (req, res) => {
            res.redirect("/");
        });
};
