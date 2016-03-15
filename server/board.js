'use strict';
const request = require('request');

const baseURL = `https://api.trello.com/1/boards/${process.env.TRELLO_BOARD_ID}`
function buildURL(partial, token) {
  return `${baseURL}${partial}?key=${process.env.TRELLO_API_KEY}&token=${token}`;
}

function getRequestChainable(accessToken) {
  return Promise.resolve({ accessToken });
}

function getMembers(req) {
  return new Promise((resolve, reject) => {
    request.get(buildURL('/members', req.accessToken), (err, res, body) => {
      if(err) {
        return reject(err);
      }
      req.members = JSON.parse(body).reduce((p, v) => { p[v.id] = v; return p; }, { });
      resolve(req);
    });
  });
}

function getMemberName(req, id) {
  if(req.members && req.members[id]) {
    let name = req.members[id].fullName;
    if(name && name.indexOf(' ') > 0) {
      name = name.substr(0, name.indexOf(' ') + 2);
    }
    return name;
  }
  return '';
}

function getLists(req) {
  return new Promise((resolve, reject) => {
    request.get(buildURL('/lists', req.accessToken), (err, res, body) => {
      if(err) {
        return reject(err);
      }
      req.lists = JSON.parse(body).reduce((p, v) => { p[v.id] = v; return p; }, { });
      resolve(req);
    });
  });
}

function getListName(req, id) {
  if(req.lists && req.lists[id]) {
    return req.lists[id].name;
  }
  return '';
}

function getCards(req) {
  return new Promise((resolve, reject) => {
    request.get(buildURL('/cards', req.accessToken), (err, res, body) => {
      req.cards = JSON.parse(body).map(card => {
        return {
          _id: card.id,
          description: card.name,
          status: getListName(req, card.idList),
          lead: '',
          pair: '',
          staff: card.idMembers
        }
      });
      req.cards.forEach(card => {
        for(let i = 0; i < card.staff.length; i++) {
          card.staff[i] = getMemberName(req, card.staff[i]);
        }
      });
      resolve(req);
    });
  });
}

module.exports = {
  getCards(accessToken) {
    return getRequestChainable(accessToken)
      .then(getMembers)
      .then(getLists)
      .then(getCards)
      .then(req => req.cards)
      .catch(err => {
        console.log('Error getting cards:');
        console.log(err);
      });
  }
}
