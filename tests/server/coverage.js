'use strict';

// Require in everything that should be included in
// the tests.  This makes the coverage numbers more
// accurate even if tests don't cover the files in
// question.  Leave out index or enum type files,
// though, as they will artificially skew the
// coverage numbers higher since they don't provide
// any actual functioanlity (and will always be 100%).

require('../../server/auth/trello');

require('../../server/webhook-events/change-card-labels');
require('../../server/webhook-events/change-card-members');
require('../../server/webhook-events/update-card');

require('../../server/board');
require('../../server/webhook-handler');

require('tap').pass('All files included for coverage');
