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
  t1.test('getLists', t2 => {
    const expected = {
      '1': lists[1],
      '2': lists[0],
      '3': lists[2]
    };

    t2.test('With an error', t3 => {
      const err = new Error('Test Error');
      getMock.yields(err, { }, null);
      board.getLists(TOKEN)
        .then(() => {
          t3.fail('rejects');
        })
        .catch(e => {
          t3.pass('rejects');
          t3.equal(getMock.callCount, 1, 'Calls Trello API once');
          t3.equal(getMock.args[0][0], getExpectedURL('/lists'), 'Gets lists from Trello API');
          t3.equal(e, err, 'Rejects expected error');
        })
        .then(t3.done);
    });

    t2.test('Without an error', t3 => {
      t3.test('With uncached lists', t4 => {
        t4.test('With non-array body returned', t5 => {
          getMock.yields(null, { }, 'This is not an array');
          board.getLists(TOKEN)
            .then(out => {
              t5.pass('resolves');
              t5.equal(getMock.callCount, 1, 'Calls Trello API once');
              t5.equal(getMock.args[0][0], getExpectedURL('/lists'), 'Gets lists from Trello API');
              t5.same(out.lists, { }, 'Resolves empty list list');
            }).catch(() => {
              t5.fail('resolves');
            })
            .then(t5.done);
        })

        t4.test('With array body returned', t5 => {
          const clock = sinon.useFakeTimers();
          getMock.yields(null, { }, lists);
          board.getLists(TOKEN)
            .then(out => {
              t5.pass('resolves');
              t5.equal(getMock.callCount, 1, 'Calls Trello API once');
              t5.equal(getMock.args[0][0], getExpectedURL('/lists'), 'Gets lists from Trello API');
              t5.same(out.lists, expected, 'Resolves expected list');
            }).catch(() => {
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
        getMock.yields(null, { }, lists);
        board.getLists(TOKEN)
          .then(out => {
            t4.pass('resolves');
            t4.equal(getMock.callCount, 0, 'Does not calls Trello API');
            t4.same(out.lists, expected, 'Resolves expected list');
          }).catch(() => {
            t4.fail('resolves');
          })
          .then(t4.done);
      });

      t3.done();
    });

    t2.done();
  });

  t1.test('getListName', t2 => {
    t2.test('with unknown list ID', t3 => {
      board.getListName('unknown', TOKEN)
        .then(name => {
          t3.pass('resolves');
          t3.equal(name, '', 'resolves an empty string');
        })
        .catch(name => {
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
        .catch(name => {
          t3.fail('resolves');
        })
        .then(t3.done);
    });

    t2.done();
  })

  t1.test('getLabels', t2 => {
    const expected = {
      '1': labels[0],
      '2': labels[1],
      '3': labels[2]
    };

    t2.test('With an error', t3 => {
      const err = new Error('Test Error');
      getMock.yields(err, { }, null);
      board.getLabels(TOKEN)
        .then(() => {
          t3.fail('rejects');
        })
        .catch(e => {
          t3.pass('rejects');
          t3.equal(getMock.callCount, 1, 'Calls Trello API once');
          t3.equal(getMock.args[0][0], getExpectedURL('/labels'), 'Gets labels from Trello API');
          t3.equal(e, err, 'Rejects expected error');
        })
        .then(t3.done);
    });

    t2.test('Without an error', t3 => {
      t3.test('With uncached labels', t4 => {
        t4.test('With non-array body returned', t5 => {
          getMock.yields(null, { }, 'This is not an array');
          board.getLabels(TOKEN)
            .then(out => {
              t5.pass('resolves');
              t5.equal(getMock.callCount, 1, 'Calls Trello API once');
              t5.equal(getMock.args[0][0], getExpectedURL('/labels'), 'Gets labels from Trello API');
              t5.same(out.labels, { }, 'Resolves empty labels object');
            }).catch(() => {
              t5.fail('resolves');
            })
            .then(t5.done);
        })

        t4.test('With array body returned', t5 => {
          const clock = sinon.useFakeTimers();
          getMock.yields(null, { }, labels);
          board.getLabels(TOKEN)
            .then(out => {
              t5.pass('resolves');
              t5.equal(getMock.callCount, 1, 'Calls Trello API once');
              t5.equal(getMock.args[0][0], getExpectedURL('/labels'), 'Gets labels from Trello API');
              t5.same(out.labels, expected, 'Resolves expected labels');
            }).catch(() => {
              t5.fail('resolves');
            })
            .then(() => {
              clock.restore();
              t5.done();
            });
        });

        t4.done();
      });

      t3.test('With cached labels', t4 => {
        getMock.yields(null, { }, labels);
        board.getLabels(TOKEN)
          .then(out => {
            t4.pass('resolves');
            t4.equal(getMock.callCount, 0, 'Does not call Trello API');
            t4.same(out.labels, expected, 'Resolves expected labels');
          }).catch(() => {
            t4.fail('resolves');
          })
          .then(t4.done);
      });

      t3.done();
    });

    t2.done();
  });

  t1.test('getCards', t2 => {
    t2.pass();
    t2.done();
  });

  t1.test('moveCard', t2 => {
    t2.pass();
    t2.done();
  });

  t1.done();
});
