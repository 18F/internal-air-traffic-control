import { combineReducers } from 'redux';
import filter from './filter';
import flights from './flights';
import statuses from './statuses';
import labels from './labels';
import members from './members';
import visibleFlights from './visibleFlights';

const localStorage = require('local-storage');
const STORAGE_KEY = 'atc-state-filter';

const stateShape = {
  filter: {
    statuses: [],
    labels: [],
    users: []
  },
  flights: [],
  statuses: [],
  labels: [],
  members: [],
  visibleFlights: []
};

const distinctReducers = combineReducers({
  filter,
  flights,
  statuses,
  labels,
  members,
  visibleFlights: () => []
});

let loaded = false;
export default function (state = stateShape, action) {
  let newState = state;
  if (!loaded) {
    loaded = true;
    if (localStorage(STORAGE_KEY)) {
      newState.filter = localStorage(STORAGE_KEY);
    }
  }
  newState = distinctReducers(newState, action);
  newState = visibleFlights(newState, action);
  localStorage(STORAGE_KEY, newState.filter);
  return newState;
}
