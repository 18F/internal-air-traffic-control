import { connect } from 'react-redux'
import Presentation from '../presentation/flight-list';

function getNonEmptyStatuses(state) {
  return state.statuses.filter(s => {
    return (state.visibleFlights.filter(f => f.status == s.name).length > 0)
  });
}

function mapStateToProps(state) {
  return {
    statuses: getNonEmptyStatuses(state)
  };
}

function mapDispatchToProps(dispatch) {
  return { };
}

export default connect(mapStateToProps, mapDispatchToProps)(Presentation);
