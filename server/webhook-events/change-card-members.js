'use strict';
const events = require('./events');
const socketMessages = require('../socket-messages');
const log = require('../getLogger')('change-card-members');

function getAvatarURL(hash) {
  if(hash) {
    return `https://trello-avatars.s3.amazonaws.com/${hash}/50.png`;;
  }
  return null;
}

module.exports = {
  events: [ events.ADD_MEMBER_TO_CARD, events.REMOVE_MEMBER_FROM_CARD ],
  handler(event, sockets) {
    log.verbose('card member changed');
    const member = {
      id: event.action.member.id,
      name: event.action.member.fullName,
      avatar: getAvatarURL(event.action.member.avatarHash)
    };

    const eventName = (event.action.type === events.ADD_MEMBER_TO_CARD ? socketMessages.addMemberToFlight : socketMessages.removeMemberFromFlight);
    sockets.emit(eventName, { flight: event.action.data.card.id, member });
  }
};
