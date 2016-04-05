import updeep from 'updeep';
import * as actions from '../actions';

export default function filter(state = { statuses: [ ] }, action) {
  const newStatusList = state.statuses.concat();

  switch(action.type) {
    case actions.Filter.ADD_STATUS:
      newStatusList.push(action.status.name);
      return updeep({ statuses: newStatusList }, state);
      break;

    case actions.Filter.REMOVE_STATUS:
      for(let i = 0; i < newStatusList.length; i++) {
        if(newStatusList[i] === action.status.name) {
          newStatusList.splice(i, 1);
          break;
        }
      }
      return updeep({ statuses: newStatusList }, state);
      break;

    default:
      return state;
  }
}
