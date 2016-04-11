import updeep from 'updeep';
import * as actions from '../actions';

function getVisibleFlights(state) {
  let filtered = state.flights.filter(flight => {
    if(state.filter.statuses.length === 0 || state.filter.statuses.indexOf(flight.status) >= 0) {
      return true;
    }
    return false;
  });

  filtered = filtered.filter(flight => {
    if(state.filter.labels.length === 0) {
      return true;
    }
    for(const label of state.filter.labels) {
      if(flight.labels.indexOf(label) >= 0) {
        return true;
      }
    }
    return false;
  });

  filtered = filtered.filter(flight => {
    if(state.filter.users.length === 0 ) {
      return true;
    }
    for(const user of state.filter.users) {
      if(flight.staff.indexOf(user) >= 0) {
        return true;
      }
    }
    return false;
  });

  return filtered;
}

export default function visibleFlights(state, action) {
  state.visibleFlights = getVisibleFlights(state);
  return state;
}
