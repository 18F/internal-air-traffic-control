import * as actions from '../actions';

export default function members(state = [], action) {
  switch (action.type) {
    case actions.Labels.LIST_IN:
      return action.list;

    default:
      return state;
  }
}
