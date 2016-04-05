import { connect } from 'react-redux'
import Presentation from '../presentation/status-list';

function getVisibleFlights(flights, filter) {
  return flights;
}

function getVisibleStatuses(statuses, filter) {
  return statuses;
}

function mapStateToProps(state) {
  return {
    flights: getVisibleFlights(state.flights, null),
    statuses: getVisibleStatuses(state.statuses, null)
  };
}

function mapDispatchToProps(dispatch) {
  return { };
}

export default connect(mapStateToProps, mapDispatchToProps)(Presentation);
