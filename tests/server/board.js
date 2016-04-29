'use strict';

const tap = require('tap');
const sinon = require('sinon');
const request = require('request');
const sandbox = sinon.sandbox.create();

const ENV = {
  ATC_TRELLO_BOARD_ID: process.env.ATC_TRELLO_BOARD_ID,
  TRELLO_API_KEY: process.env.TRELLO_API_KEY
};

tap.tearDown(() => {
  process.env.ATC_TRELLO_BOARD_ID = ENV.ATC_TRELLO_BOARD_ID;
  process.env.TRELLO_API_KEY = ENV.TRELLO_API_KEY;
  sandbox.restore();
});

tap.beforeEach(done => {
  sandbox.reset();
  done();
});

const TOKEN = 'trello-token'
process.env.ATC_TRELLO_BOARD_ID = 'trello-board-id';
process.env.TRELLO_API_KEY = 'trello-api-key';

const getMock = sandbox.stub(request, 'get');

const board = require('../../server/board');

function getExpectedURL(partial, params) {
  const baseURL = `https://api.trello.com/1/boards/${process.env.ATC_TRELLO_BOARD_ID}`;
  let extraGet = '';
  if (params) {
    extraGet = '&';
    for (const key of Object.keys(params)) {
      extraGet += `${key}=${params[key]}`;
    }
  }
  return `${baseURL}${partial}?key=${process.env.TRELLO_API_KEY}&token=${TOKEN}${extraGet}`;
}

tap.test('Trello board methods', t1 => {
  t1.test('getLists', t2 => {
    const lists = [
      { pos: 2, name: 'List 2', id: 2 },
      { pos: 1, name: 'List 1', id: 1 },
      { pos: 3, name: 'List 3', id: 3 }
    ];

    const expected = {
      '1': lists[1],
      '2': lists[0],
      '3': lists[2]
    };

    t2.test('Without an error', t3 => {
      getMock.yields(null, { }, lists);
      board.getLists(TOKEN)
        .then(out => {
          t3.pass('resolves');
          t3.equal(getMock.callCount, 1, 'Calls Trello API once');
          t3.equal(getMock.args[0][0], getExpectedURL('/lists'), 'Gets lists from Trello API');
          t3.same(out.lists, expected, 'Resolves expected list');
        }).catch(() => {
          t3.fail('resolves');
        })
        .then(t3.done);
    });

    t2.done();
  });

  t1.test('getListName', t2 => {
    t2.done();
  })

  t1.test('getLabels', t2 => {
    t2.done();
  });

  t1.test('getCards', t2 => {
    t2.done();
  });

  t1.test('moveCard', t2 => {
    t2.done();
  });

  t1.done();
});
