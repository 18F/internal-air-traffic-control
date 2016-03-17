'use strict';

const TrelloStrategy = require('passport-trello').Strategy;
// const request = require('request');
// const sheet = require('../sheet');

module.exports = {
  setupMiddleware: (server, passport, errorURL) => {
    passport.use(new TrelloStrategy({
      consumerKey: process.env.TRELLO_API_KEY,
      consumerSecret: process.env.TRELLO_CLIENT_SECRET,
      callbackURL: process.env.TRELLO_CALLBACK_URL,
      passReqToCallback: true,
      trelloParams: {
        scope: 'read,write',
        name: 'AirTraffic Control',
        expiration: '30days'
      }
    }, (req, token, tokenSecret, profile, done) => {
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
        res.redirect('/');
      });
  }
};
