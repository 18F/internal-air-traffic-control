'use strict';
const log = require('./getLogger')('webhook-handler');
const board = require('./board');

module.exports = function(sockets) {
  return function(event) {
    log.info('Got a webhook event from Trello');
    switch(event.action.type) {
      case 'updateCard':
      log.verbose('Card changed');
        // get this card and then send it to the sockets
        const card = {
          id: event.action.data.card.id,
          description: event.action.data.card.name
        };

        const promises = [ ];
        if(event.action.data.card.idList) {
          promises.push(board.getListName(event.action.data.card.idList, process.env.TRELLO_API_TOKEN).then(listName => {
            card.listID = event.action.data.card.idList
            card.status = listName;
          }));
        }

        Promise.all(promises)
          .then(() => sockets.emit('update single flight', card));
        break;

      case 'updateList':
        break;

      default:
        log.verbose(`Unhandled webhook type: ${event.action.type}`);
        break;
    }
  };
};
