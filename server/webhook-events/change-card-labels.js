'use strict';
const events = require('./events');
const socketMessages = require('../socket-messages');
const log = require('../getLogger')('change-card-labels');

module.exports = {
  events: [events.ADD_LABEL_TO_CARD, events.REMOVE_LABEL_FROM_CARD],
  handler(event, sockets) {
    log.verbose('card label changed');

    const eventName = (event.action.type === events.ADD_LABEL_TO_CARD ? socketMessages.addLabelToFlight : socketMessages.removeLabelFromFlight);
    sockets.emit(eventName, { flight: event.action.data.card.id, label: event.action.data.label.name });
  }
};
