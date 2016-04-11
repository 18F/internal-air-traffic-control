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

function getUILabels(labels, flights, filter) {
  return labels.map(l => ({
    name: l.name,
    id: l.id,
    flightCount: flights.filter(f => f.labels.indexOf(l.name) >= 0).length,
    checked: (filter.filter(labelFilter => labelFilter === l.name).length > 0),
    real: l
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

function getToggleHandler(add, remove, dispatch) {
  return obj => event => {
    const enabled = event.target.checked;
    if(enabled) {
      dispatch(add(obj));
    } else {
      dispatch(remove(obj));
    }
  }
}

function mapStateToProps(state) {
  return {
    statuses: getUIStatuses(state.statuses, state.flights, state.filter.statuses),
    labels: getUILabels(state.labels, state.flights, state.filter.labels),
    members: getUIMembers(state.members, state.flights, state.filter.users)
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getStatusToggleHandler: getToggleHandler(actions.Filter.AddStatus, actions.Filter.RemoveStatus, dispatch),
    getLabelToggleHandler: getToggleHandler(actions.Filter.AddLabel, actions.Filter.RemoveLabel, dispatch),
    getMemberToggleHandler: getToggleHandler(actions.Filter.AddUser, actions.Filter.RemoveUser, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Presentation);
