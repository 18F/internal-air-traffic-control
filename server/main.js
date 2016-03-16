'use strict';

require('dotenv').config();
const restify = require('restify');
const passport = require('passport');
const io = require('socket.io');
const trelloAuth = require('./auth/trello');
const sessions = require('client-sessions');
const board = require('./board');
const PORT = process.env.PORT || 5000;
const bpaTrello = require('bpa-trello-dashboard/app');

if(!process.env.TRELLO_API_KEY) {
  console.error('Trello API key not set.  Cannot continue.');
  process.exit(1);
}
if(!process.env.TRELLO_CLIENT_SECRET) {
  console.error('Trello client secret not set.  Cannot continue.');
  process.exit(1);
}
if(!process.env.TRELLO_CALLBACK_URL) {
  console.error('Trello callback URL not set.  Cannot continue.');
  process.exit(1);
}

if(!process.env.TRELLO_BOARD_ID) {
  console.error('Trello board ID not set.  Cannot continue.');
  process.exit(1);
}

if(!process.env.SESSION_SECRET) {
  console.warn('No SESSION_SECRET set.  Using less secure default.');
}

const server = restify.createServer({ name: 'Traffic Control API' });
server.use(sessions({
  cookieName: 'session',
  secret: process.env.SESSION_SECRET || 'N4JnqJmmMjjEHHq22yIAkN0owlsMVJeYzsgBkSQ0zSPGrHmdxLVLfnFYGhccog7',
  duration: 24 * 60 * 60 * 1000, // how long the session will stay valid in ms
  activeDuration: 1000 * 60 * 5, // if expiresIn < activeDuration, the session will be extended by activeDuration milliseconds
  cookie: {
    httpOnly: true
  }
}));
const sockets = io.listen(server.server);

server.use(require('restify-redirect')());
server.use(restify.queryParser());
server.use(passport.initialize());
server.use(passport.session());

server.get('/auth/reset', (req, res, next) => {
  req.logout();
  req.session.destroy();
  res.send(200);
  next();
});

server.get('/auth/error', (req, res, next) => {
  return next(new restify.UnauthorizedError(''));
});

trelloAuth.setupMiddleware(server, passport, '/auth/trello');

server.use((req, res, next) => {
  if(!req.user) {
    res.redirect('/auth/trello');
    next();
  } else {
    res.charSet('utf-8');
    next();
  }
});

server.get('/api/statuses', (req, res, next) => {
  board.getLists(req.user.accessToken)
    .then(req => {
      const statuses = [ ];
      for(let list of Object.keys(req.lists)) {
        statuses.push({
          id: list,
          name: req.lists[list].name
        });
      }
      res.send(statuses);
    });
  next();
});

server.get('/api/flights', (req, res, next) => {
  board.getCards(req.user.accessToken)
    .then(rows => {

      let delay = 1000;
      const cardCreator = new bpaTrello.CardCreator(null, process.env.TRELLO_BOARD_ID);

      for(let r of rows) {
        switch(r.lead.toLowerCase()) {
          case 'none':
          case 'tbd':
            r.lead = '';
            break;
        }
        switch(r.pair.toLowerCase()) {
          case 'none':
          case 'tbd':
            r.pair = '';
            break;
        }
      }
      res.send(rows);
    })
    .catch(e => {
      console.log('Error getting rows from sheet:');
      console.log(e);
      res.send(new restify.InternalServerError());
    });
  next();
});

server.put('/api/flights', restify.bodyParser(), (req, res, next) => {
  board.moveCard(req.body._id, req.body.listID, req.user.accessToken)
    .then(req => {
      res.send({ });
      sockets.emit('flight changed', req.card);
    })
    .catch(e => res.send(new restify.InternalServerError(e)));
  next();
});

server.get('/api/user', (req, res, next) => {
  res.send({ loggedIn: true, user: { name: req.user.name } });
  next();
});

server.get(/.*/, restify.serveStatic({
  directory: './web/static',
  default: 'index.html',
  charSet: 'utf-8'
}));

server.listen(PORT, () => {
  console.log(`${server.name} listening at ${server.url}`);
});
