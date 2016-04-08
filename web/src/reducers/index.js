import { combineReducers } from 'redux';
import filter from './filter';
import flights from './flights';
import statuses from './statuses';
import members from './members';
import visibleFlights from './visibleFlights';

const stateShape = {
  filters: {
    statuses: [ ]
  },
  filters: [ ],
  statuses: [ ],
  members: [ ],
  visibleFlights: [ ]
};

const distinctReducers = combineReducers({
  filter,
  flights,
  statuses,
  members,
  visibleFlights: state => [ ]
});

export default function(state = stateShape, action) {
  state = distinctReducers(state, action);
  state = visibleFlights(state, action);
  return state;
};
