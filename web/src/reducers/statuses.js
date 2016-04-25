import * as actions from '../actions';

export default function statuses(state = [], action) {
  switch (action.type) {
    case actions.Statuses.LIST_IN:
      return action.list;

    default:
      return state;
  }
}
