'use strict';
const request = require('request');
const log = require('./getLogger')('board');
const Cache = require('timed-cache');

// 30-minute cache
const cache = new Cache({ defaultTtl: 1800000 });

const baseURL = `https://api.trello.com/1/boards/${process.env.ATC_TRELLO_BOARD_ID}`;
function buildURL(partial, token, params) {
  let extraGet = '';
  if(params) {
    extraGet = '&';
    for(const key of Object.keys(params)) {
      extraGet += `${key}=${params[key]}`;
    }
  }
  return `${baseURL}${partial}?key=${process.env.TRELLO_API_KEY}&token=${token}${extraGet}`;
}

function getRequestChainable(accessToken) {
  return Promise.resolve({ accessToken });
}

function getMembers(req) {
  if (cache.get('members')) {
    req.members = cache.get('members');
    return Promise.resolve(req);
  }

  return new Promise((resolve, reject) => {
    request.get(buildURL('/members', req.accessToken, { fields: 'username,fullName,avatarHash,initials' }), { json: true }, (err, res, body) => {
      if (err) {
        return reject(err);
      }
      if (Array.isArray(body)) {
        req.members = body.reduce((p, v) => { p[v.id] = v; return p; }, { });
        cache.put('members', req.members);
      } else {
        req.members = { };
      }
      return resolve(req);
    });
  });
}

function getMemberName(req, id) {
  if (req.members && req.members[id]) {
    return req.members[id].fullName;
  }
  return '';
}

function getMemberAvatar(req, id) {
  if(req.members && req.members[id] && req.members[id].avatarHash) {
    return `https://trello-avatars.s3.amazonaws.com/${req.members[id].avatarHash}/50.png`
  }
  return null;
}

function getLists(req) {
  if (cache.get('lists')) {
    req.lists = cache.get('lists');
    return Promise.resolve(req);
  }

  return new Promise((resolve, reject) => {
    request.get(buildURL('/lists', req.accessToken), { json: true }, (err, res, body) => {
      if (err) {
        return reject(err);
      }
      if (Array.isArray(body)) {
        body.sort((a, b) => a.pos - b.pos);
        req.lists = body.reduce((p, v) => {
          // Don't even show grounded flights
          if (v.name !== 'Grounded') {
            p[v.id] = v;
          }
          return p;
        }, { });
        cache.put('lists', req.lists);
      } else {
        req.lists = { };
      }
      return resolve(req);
    });
  });
}

function getListName(req, id) {
  if (req.lists && req.lists[id]) {
    return req.lists[id].name;
  }
  return '';
}

function getListPosition(req, id) {
  if (req.lists && req.lists[id]) {
    return req.lists[id].pos;
  }
  return '';
}

function getLabels(req) {
  if (cache.get('labels')) {
    req.labels = cache.get('labels');
    return Promise.resolve(req);
  }

  return new Promise((resolve, reject) => {
    request.get(buildURL('/labels', req.accessToken), { json: true }, (err, res, body) => {
      if (err) {
        return reject(err);
      }
      if (Array.isArray(body)) {
        req.labels = body.reduce((p, v) => {
          // Only stash labels with names
          if (v.name) {
            p[v.id] = v;
          }
          return p;
        }, { });
        cache.put('labels', req.labels);
      } else {
        req.labels = { };
      }
      return resolve(req);
    });
  });
}

function getLabelName(req, id) {
  if (req.labels && req.labels[id]) {
    return req.labels[id].name;
  }
  return '';
}

function getCards(req) {
  return new Promise((resolve, reject) => {
    request.get(buildURL('/cards', req.accessToken), { json: true }, (err, res, body) => {
      if (err) {
        return reject(err);
      }
      if (Array.isArray(body)) {
        body.sort((a, b) => getListPosition(req, a.idList) - getListPosition(req, b.idList));

        req.cards = body.map(card => ({
          id: card.id,
          description: card.name,
          status: getListName(req, card.idList),
          listID: card.idList,
          labels: card.idLabels.map(l => getLabelName(req, l)),
          lead: '',
          pair: '',
          staff: card.idMembers
        }));

        for (let j = 0; j < req.cards.length; j++) {
          const card = req.cards[j];
          if (!card.status) {
            req.cards.splice(j, 1);
            j--;
          } else {
            for (let i = 0; i < card.staff.length; i++) {
              card.staff[i] = {
                id: card.staff[i],
                name: getMemberName(req, card.staff[i]),
                avatar: getMemberAvatar(req, card.staff[i])
              };
            }
          }
        }
      } else {
        req.cards = [];
      }
      return resolve(req);
    });
  });
}

function moveCard(req) {
  return new Promise((resolve, reject) => {
    request.put(`https://api.trello.com/1/cards/${req.cardID}?key=${process.env.TRELLO_API_KEY}&token=${req.accessToken}`, { json: true, body: { idList: req.listID } }, (err, res, body) => {
      if (err) {
        return reject(err);
      }
      req.card = {
        id: body.id,
        listID: body.idList
      };
      return resolve(req);
    });
  });
}

module.exports = {
  getLists(accessToken) {
    return getLists({ accessToken });
  },

  getLabels(accessToken) {
    return getLabels({ accessToken });
  },

  getCards(accessToken) {
    return getRequestChainable(accessToken)
      .then(getMembers)
      .then(getLists)
      .then(getLabels)
      .then(getCards)
      // .then(req => req.cards)
      .catch(err => {
        log.error('Error getting cards:');
        log.error(err);
        throw err;
      });
  },

  moveCard(id, listID, accessToken) {
    return getRequestChainable(accessToken)
      .then(req => { req.cardID = id; return req; })
      .then(req => { req.listID = listID; return req; })
      .then(moveCard)
      .catch(err => {
        log.error('Error moving card:');
        log.error(err);
        throw err;
      });
  }
};
