import { connect } from 'react-redux'
import Presentation from '../presentation/status-list';
import * as actions from '../actions';

function getUIStatuses(statuses, flights, filter) {
  return statuses.map(s => ({
    name: s.name,
    id: s.id,
    flightCount: flights.filter(f => f.status === s.name).length,
    checked: (filter.statuses.filter(statusFilter => statusFilter === s.name).length > 0),
    real: s
  }));
}

function mapStateToProps(state) {
  return {
    statuses: getUIStatuses(state.statuses, state.flights, state.filter)
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getToggleHandler(status) {
      return (event, enabled) => {
        let action;
        if(enabled) {
          action = actions.Filter.AddStatus;
        } else {
          action = actions.Filter.RemoveStatus;
        }
        dispatch(action(status));
      };
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Presentation);
