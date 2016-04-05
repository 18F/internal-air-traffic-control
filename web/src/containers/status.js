import { connect } from 'react-redux'
import Presentation from '../presentation/status';

function getVisibleFlights(flights, status, filter) {
  return flights.filter(f => s.status === status.name);
}

function mapStateToProps(state) {
  return {
    flights: getVisibleFlights(state.flights, this.props.status, null)
  };
}

function mapDispatchToProps(dispatch) {
  return { };
}

export default connect(mapStateToProps, mapDispatchToProps)(Presentation);
