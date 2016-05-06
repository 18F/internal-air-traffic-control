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

function runGetTest(methodName, apiData, expectedURL, expectedData, dataName, test) {
  test.test(methodName, t1 => {
    t1.test('With an error', t2 => {
      const err = new Error('Test Error');
      getMock.yields(err, { }, null);
      board[methodName](TOKEN)
        .then(() => {
          t2.fail('rejects');
        })
        .catch(e => {
          t2.pass('rejects');
          t2.equal(getMock.callCount, 1, 'Calls Trello API once');
          t2.equal(getMock.args[0][0], expectedURL, `Gets ${dataName} from Trello API`);
          t2.equal(e, err, 'Rejects expected error');
        })
        .then(t2.done);
    });

    t1.test('Without an error', t3 => {
      t3.test('With uncached lists', t4 => {
        t4.test('With non-array body returned', t5 => {
          getMock.yields(null, { }, 'This is not an array');
          board[methodName](TOKEN)
            .then(out => {
              t5.pass('resolves');
              t5.equal(getMock.callCount, 1, 'Calls Trello API once');
              t5.equal(getMock.args[0][0], expectedURL, `Gets ${dataName} from Trello API`);
              t5.same(out[dataName], { }, `Resolves empty ${dataName} list`);
            }).catch(() => {
              t5.fail('resolves');
            })
            .then(t5.done);
        })

        t4.test('With array body returned', t5 => {
          const clock = sinon.useFakeTimers();
          getMock.yields(null, { }, apiData);
          board[methodName](TOKEN)
            .then(out => {
              t5.pass('resolves');
              t5.equal(getMock.callCount, 1, 'Calls Trello API once');
              t5.equal(getMock.args[0][0], expectedURL, `Gets ${dataName} from Trello API`);
              console.log(out[dataName])
              t5.same(out[dataName], expectedData, 'Resolves expected list');
            }).catch((e) => {
              console.log(e);
              t5.fail('resolves');
            })
            .then(() => {
              clock.restore();
              t5.done();
            });
        });

        t4.done();
      });

      t3.test('With cached lists', t4 => {
        getMock.yields(null, { }, apiData);
        board[methodName](TOKEN)
          .then(out => {
            t4.pass('resolves');
            t4.equal(getMock.callCount, 0, 'Does not call Trello API');
            t4.same(out[dataName], expectedData, `Resolves expected ${dataName} list`);
          }).catch(() => {
            t4.fail('resolves');
          })
          .then(t4.done);
      });

      t3.done();
    });

    t1.done();
  });
}

const members = [
  { id: '1', username: 'user1', fullName: 'User One', avatarHash: 'avatar1', initials: 'u1' },
  { id: '2', username: 'user2', fullName: 'User Two', avatarHash: 'avatar2', initials: 'u2' },
  { id: '3', username: 'user3', fullName: 'User Tre', avatarHash: 'avatar3', initials: 'u3' }
];

const lists = [
  { pos: 2, name: 'List 2', id: '2' },
  { pos: 1, name: 'List 1', id: '1' },
  { pos: 3, name: 'List 3', id: '3' }
];

const labels = [
  { id: '1', idBoard: '123', name: 'Label 1', color: 'color', uses: 1 },
  { id: '2', idBoard: '231', name: 'Label 2', color: 'color', uses: 2 },
  { id: '3', idBoard: '321', name: 'Label 3', color: 'color', uses: 4 }
];

tap.test('Trello board methods', t1 => {
  runGetTest(
    'getMembers',
    members,
    getExpectedURL('/members', { fields: 'username,fullName,avatarHash,initials' }),
    { '1': members[0], '2': members[1], '3': members[2] },
    'members',
    t1
  );

  runGetTest(
    'getLists',
    lists,
    getExpectedURL('/lists'),
    { '1': lists[1], '2': lists[0], '3': lists[2] },
    'lists',
    t1
  );

  t1.test('getListName', t2 => {
    t2.test('with unknown list ID', t3 => {
      board.getListName('unknown', TOKEN)
        .then(name => {
          t3.pass('resolves');
          t3.equal(name, '', 'resolves an empty string');
        })
        .catch(() => {
          t3.fail('resolves');
        })
        .then(t3.done);
    });

    t2.test('with a known list ID', t3 => {
      board.getListName(lists[0].id, TOKEN)
        .then(name => {
          t3.pass('resolves');
          t3.equal(name, lists[0].name, 'resolves the list name');
        })
        .catch(() => {
          t3.fail('resolves');
        })
        .then(t3.done);
    });

    t2.done();
  })

  runGetTest(
    'getLabels',
    labels,
    getExpectedURL('/labels'),
    { '1': labels[0], '2': labels[1], '3': labels[2] },
    'labels',
    t1
  );

  t1.test('getCards', t2 => {
    t2.pass();
    t2.done();
  });

  t1.test('moveCard', t2 => {
    board.moveCard('cardID', 'listID', TOKEN)
      .then(() => {
        t2.fail('rejects');
      })
      .catch(() => {
        t2.pass('rejects');
      })
      .then(t2.done);
  });

  t1.done();
});
