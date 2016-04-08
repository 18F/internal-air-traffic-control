import { connect } from 'react-redux'
import Presentation from '../presentation/filter-toolbar-status';
import * as actions from '../actions';

function getUIStatuses(statuses, flights, filter) {
  return statuses.map(s => ({
    name: s.name,
    id: s.id,
    flightCount: flights.filter(f => f.status === s.name).length,
    checked: (filter.filter(statusFilter => statusFilter === s.name).length > 0),
    real: s
  }));
}

function getUIMembers(members, flights, filter) {
  return members.map(m => ({
    name: m.fullName,
    id: m.id,
    flightCount: flights.filter(f => f.staff.indexOf(m.fullName) >= 0).length,
    checked: (filter.filter(userFilter => userFilter === m.fullName).length > 0),
    real: m
  }));
}

function mapStateToProps(state) {
  return {
    statuses: getUIStatuses(state.statuses, state.flights, state.filter.statuses),
    members: getUIMembers(state.members, state.flights, state.filter.users)
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getStatusToggleHandler(status) {
      return (event) => {
        const enabled = event.target.checked;
        let action;
        if(enabled) {
          action = actions.Filter.AddStatus;
        } else {
          action = actions.Filter.RemoveStatus;
        }
        dispatch(action(status));
      };
    },

    getMemberToggleHandler(member) {
      return (event) => {
        const enabled = event.target.checked;
        let action;
        if(enabled) {
          action = actions.Filter.AddUser;
        } else {
          action = actions.Filter.RemoveUser;
        }
        dispatch(action(member));
      };
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Presentation);
