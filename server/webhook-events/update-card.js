'use strict';
const events = require('./events');
const board = require('../board');
const socketMessages = require('../socket-messages');
const log = require('../getLogger')('update-card');

module.exports = {
  events: [events.UPDATE_CARD],
  handler(event, sockets) {
    log.verbose('Card changed');
    const card = {
      id: event.action.data.card.id,
      description: event.action.data.card.name
    };

    if (event.action.data.card.idList) {
      board.getListName(event.action.data.card.idList, process.env.TRELLO_API_TOK).then(listName => {
        card.listID = event.action.data.card.idList;
        card.status = listName;
        sockets.emit(socketMessages.updateOneFlight, card);
      });
    } else {
      sockets.emit(socketMessages.updateOneFlight, card);
    }
  }
};
