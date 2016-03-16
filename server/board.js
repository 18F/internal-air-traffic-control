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
    request.get(buildURL('/members', req.accessToken), { json: true }, (err, res, body) => {
      if(err) {
        return reject(err);
      }
      if(Array.isArray(body)) {
        req.members = body.reduce((p, v) => { p[v.id] = v; return p; }, { });
      } else {
        req.members = { };
      }
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
    request.get(buildURL('/lists', req.accessToken), { json: true }, (err, res, body) => {
      if(err) {
        return reject(err);
      }
      if(Array.isArray(body)) {
        req.lists = body.reduce((p, v) => { p[v.id] = v; return p; }, { });
      } else {
        req.lists = { };
      }
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

function getListID(req, name) {
  if(req.lists) {
    for(let listID of Object.keys(req.lists)) {
      if(req.lists[listID].name === name) {
        return listID;
      }
    }
  }
  return '';
}

function getCards(req) {
  return new Promise((resolve, reject) => {
    request.get(buildURL('/cards', req.accessToken), { json: true }, (err, res, body) => {
      if(Array.isArray(body)) {
        req.cards = body.map(card => {
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
      } else {
        req.cards = [ ];
      }
      resolve(req);
    });
  });
}

module.exports = {
  getLists(accessToken) {
    return getLists({ accessToken });
  },

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
  },

  moveCard(id, listName, accessToken) {
    return getRequestChainable(accessToken)
      .then(getLists)
      .then(req => {
        return new Promise((resolve, reject) => {
          const listID = getListID(req, listName);
          request.put(`https://api.trello.com/1/cards/${id}?key=${process.env.TRELLO_API_KEY}&token=${accessToken}`, { json: true, body: { idList: listID }}, function(err, req, body) {
            if(err) {
              return reject(err);
            }
            resolve();
          });
        });
      })
      .catch(err => {
        console.log('Error updating card:');
        console.log(err);
      });
  }
}
