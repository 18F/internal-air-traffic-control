import { connect } from 'react-redux';
import Presentation from '../presentation/filter-toolbar';
import * as actions from '../actions';

function getUIObj(objs, flightCount, filter) {
  return objs.map(o => ({
    name: o.name || o.fullName,
    id: o.id,
    flightCount: flightCount(o),
    checked: (filter.filter(f => f === (o.name || o.fullName)).length > 0),
    real: o
  }));
}

function getUIStatuses(statuses, flights, filter) {
  const flightCount = status => flights.filter(f => f.status === status.name).length;
  return getUIObj(statuses, flightCount, filter);
}

function getUILabels(labels, flights, filter) {
  const flightCount = label => flights.filter(f => f.labels.indexOf(label.name) >= 0).length;
  return getUIObj(labels, flightCount, filter);
}

function getUIMembers(members, flights, filter) {
  const flightCount = staff => flights.filter(f => f.staff.indexOf(staff.fullName) >= 0).length;
  return getUIObj(members, flightCount, filter);
}

function getToggleHandler(add, remove, dispatch) {
  return obj => event => {
    const enabled = event.target.checked;
    if (enabled) {
      dispatch(add(obj));
    } else {
      dispatch(remove(obj));
    }
  };
}

function mapStateToProps(state) {
  return {
    statuses: getUIStatuses(state.statuses, state.flights, state.filter.statuses),
    labels: getUILabels(state.labels, state.flights, state.filter.labels),
    members: getUIMembers(state.members, state.flights, state.filter.users),
    text: state.filter.text
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getStatusToggleHandler: getToggleHandler(actions.Filter.addStatus, actions.Filter.removeStatus, dispatch),
    getLabelToggleHandler: getToggleHandler(actions.Filter.addLabel, actions.Filter.removeLabel, dispatch),
    getMemberToggleHandler: getToggleHandler(actions.Filter.addUser, actions.Filter.removeUser, dispatch),
    textChangeHandler: event => {
      dispatch(actions.Filter.changeText(event.target.value));
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Presentation);
