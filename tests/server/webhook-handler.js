'use strict';

const tap = require('tap');
const sinon = require('sinon');
const requireMock = require('mock-require');

const EVENT_NAME = 'Test Event';
const HANDLER = {
  events: [ EVENT_NAME ],
  handler: sinon.spy()
};
requireMock('../../server/webhook-events', [ HANDLER ]);

const EVENT = {
  action: {
    type: 'Junk'
  }
};

const SOCKETS = { };

const handler = require('../../server/webhook-handler');

tap.test('Webhook Handler', t1 => {
  const instance = handler(SOCKETS);
  t1.equal(typeof instance, 'function', 'returns a function');

  t1.test('Handles event of unknown type', t2 => {
    EVENT.action.type = 'Junk';
    instance(EVENT);
    t2.equal(HANDLER.handler.callCount, 0, 'the internal handler is not called');
    t2.end();
  });

  t1.test('Handles event of a known type', t2 => {
    EVENT.action.type = EVENT_NAME;
    instance(EVENT);
    t2.equal(HANDLER.handler.callCount, 1, 'the internal handler is called once');
    t2.equal(HANDLER.handler.args[0][0], EVENT, 'passes in the original event');
    t2.equal(HANDLER.handler.args[0][1], SOCKETS, 'passes in the sockets object');
    t2.end();
  })

  t1.end();
});

requireMock.stopAll();
