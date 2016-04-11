import updeep from 'updeep';
import * as actions from '../actions';

export default function flights(state = [], action) {
  switch (action.type) {
    case actions.Flights.LIST_IN:
      return action.list;

    case actions.Flights.ONE_IN:
      {
        const index = state.indexOf(action.flight.id);
        if (index >= 0) {
          const update = { };
          update[index] = action.flight;
          return updeep(update, state);
        }
        return state;
      }
    default:
      return state;
  }
}
