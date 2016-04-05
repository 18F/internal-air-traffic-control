import { connect } from 'react-redux'
import Presentation from '../presentation/flight-list';

function getVisibleFlights(flights, filter) {
  return flights;
}

function mapStateToProps(state) {
  return {
    flights: getVisibleFlights(state.flights, null),
    statuses: state.statuses
  };
}

function mapDispatchToProps(dispatch) {
  return { };
}

export default connect(mapStateToProps, mapDispatchToProps)(Presentation);
