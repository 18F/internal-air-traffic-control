'use strict';

const TrelloStrategy = require('passport-trello').Strategy;
//const request = require('request');
//const sheet = require('../sheet');

module.exports = {
  setupMiddleware: function(server, passport, errorURL) {
    passport.use(new TrelloStrategy({
      consumerKey: process.env.TRELLO_API_KEY,
      consumerSecret: process.env.TRELLO_CLIENT_SECRET,
      callbackURL: process.env.TRELLO_CALLBACK_URL,
      passReqToCallback: true,
      trelloParams: {
        scop: "read,write",
        name: "AirTraffic Control",
        expiration: "30days"
      }
    }, function(req, token, tokenSecret, profile, done) {
      done(null, {
        accessToken: token,
        name: profile.displayName
      });
    }));

    passport.serializeUser((user, done) => {
      done(null, JSON.stringify(user));
    });

    passport.deserializeUser((user, done) => {
      done(null, JSON.parse(user));
    });

    server.get('/auth/trello', passport.authenticate('trello'));
    server.get('/auth/trello/callback',
      passport.authenticate('trello', { failureRedirect: errorURL }),
      (req, res) => {
        console.log('YAY HERE');
        res.redirect('/');
      });
  },

  refresh: function(req) {
    return new Promise((resolve, reject) => {
      if(!req.user || !req.user.refreshToken) {
        return reject(new Error('No user or refresh token'));
      }

      if(req.user.expires > Date.now()) {
        resolve();
      } else {
        request.post('https://www.googleapis.com/oauth2/v4/token', {
          form: {
              'client_id': process.env.GOOG_CLIENT_ID,
              'client_secret': process.env.GOOG_CLIENT_SECRET,
              'refresh_token': req.user.refreshToken,
              'grant_type': 'refresh_token'
          } }, function(err, res, body) {
            if(err) {
              return reject(err);
            }

            try {
              body = JSON.parse(body);
            } catch(e) {
              return reject(new Error('Could not parse refreshed token body'));
            }

            if(body.error) {
              return reject(new Error(body.error_description));
            }

            req.user.accessToken = body.access_token;
            req.user.expires = (Date.now() + (30 * 60 * 1000));
            req.login(req.user, () => {
              resolve();
            });
          });
      }
    });
  }
};
