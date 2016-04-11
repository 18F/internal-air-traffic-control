import { connect } from 'react-redux';
import Presentation from '../presentation/status-group';

function getVisibleFlights(flights, status) {
  return flights.filter(f => f.status === status.name);
}

function mapStateToProps(state, props) {
  return {
    flights: getVisibleFlights(state.visibleFlights, props.status)
  };
}

function mapDispatchToProps() {
  return { };
}

export default connect(mapStateToProps, mapDispatchToProps)(Presentation);
