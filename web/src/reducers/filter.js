import updeep from 'updeep';
import * as actions from '../actions';

export default function filter(state = { statuses: [ ], labels: [ ], users: [ ] }, action) {
  const newStatusList = state.statuses.concat();
  const newLabelList = state.labels.concat();
  const newUserList = state.users.concat();

  switch(action.type) {
    case actions.Filter.ADD_STATUS:
      newStatusList.push(action.status.name);
      return updeep({ statuses: newStatusList }, state);

    case actions.Filter.REMOVE_STATUS:
      for(let i = 0; i < newStatusList.length; i++) {
        if(newStatusList[i] === action.status.name) {
          newStatusList.splice(i, 1);
          break;
        }
      }
      return updeep({ statuses: newStatusList }, state);

    case actions.Filter.ADD_LABEL:
      newLabelList.push(action.label.name);
      return updeep({ labels: newLabelList }, state);

    case actions.Filter.REMOVE_LABEL:
      for(let i = 0; i < newLabelList.length; i++) {
        if(newLabelList[i] === action.label.name) {
          newLabelList.splice(i, 1);
          break;
        }
      }
      return updeep({ labels: newLabelList }, state);

    case actions.Filter.ADD_USER:
      newUserList.push(action.user.fullName);
      return updeep({ users: newUserList }, state);

    case actions.Filter.REMOVE_USER:
      for(let i = 0; i < newUserList.length; i++) {
        if(newUserList[i] === action.user.fullName) {
          newUserList.splice(i, 1);
          break;
        }
      }
      return updeep({ users: newUserList }, state);

    default:
      return state;
  }
}
