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

  switch(action.type) {
    case actions.Filter.ADD_STATUS:
    case actions.Filter.REMOVE_STATUS:
    case actions.Filter.ADD_USER:
    case actions.Filter.REMOVE_USER:
      state.visibleFlights = getVisibleFlights(state);
      return state;

    default:
      return state;
  }
}
