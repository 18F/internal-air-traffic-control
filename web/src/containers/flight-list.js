import { connect } from 'react-redux';
import Presentation from '../presentation/flight-list';

function getNonEmptyStatuses(state) {
  return state.statuses.filter(s => state.visibleFlights.filter(f => f.status === s.name).length > 0);
}

function mapStateToProps(state) {
  return {
    statuses: getNonEmptyStatuses(state)
  };
}

function mapDispatchToProps() {
  return { };
}

export default connect(mapStateToProps, mapDispatchToProps)(Presentation);
