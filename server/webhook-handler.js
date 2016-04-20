'use strict';
const log = require('./getLogger')('webhook-handler');
const handlers = require('./webhook-events');

module.exports = function webhookEventHandlerCreator(sockets) {
  return function webhookEventHandler(event) {
    log.info(`Got a webhook event [${event.action.type}] from Trello`);

    for (const handler of handlers) {
      if (handler.event === event.action.type) {
        handler.handler(event, sockets);
      }
    }
  };
};
