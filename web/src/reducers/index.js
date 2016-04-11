import { combineReducers } from 'redux';
import filter from './filter';
import flights from './flights';
import statuses from './statuses';
import labels from './labels';
import members from './members';
import visibleFlights from './visibleFlights';

const stateShape = {
  filter: {
    statuses: [ ],
    labels: [ ],
    users: [ ]
  },
  statuses: [ ],
  labels: [ ],
  members: [ ],
  visibleFlights: [ ]
};

const distinctReducers = combineReducers({
  filter,
  flights,
  statuses,
  labels,
  members,
  visibleFlights: state => [ ]
});

export default function(state = stateShape, action) {
  state = distinctReducers(state, action);
  state = visibleFlights(state, action);
  return state;
};
