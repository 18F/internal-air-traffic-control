import updeep from 'updeep';
import * as actions from '../actions';

export default function visibleFlights(state, action) {

  switch(action.type) {
    case actions.Filter.ADD_STATUS:
    case actions.Filter.REMOVE_STATUS:
      state.visibleFlights = state.flights.filter(flight => {
        if(state.filter.statuses.indexOf(flight.status) >= 0) {
          return true;
        }
        return false;
      });
      return state;

    default:
      return state;
  }
}
