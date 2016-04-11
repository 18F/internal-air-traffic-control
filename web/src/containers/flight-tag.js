import { connect } from 'react-redux'
import Presentation from '../presentation/flight-tag';

function mapStateToProps(state) {
  const labels = { };
  console.log(state.labels)
  for(const label of state.labels) {
    labels[label.name] = label;
  }

  return {
    labels
  };
}

function mapDispatchToProps(dispatch) {
  return { };
}

export default connect(mapStateToProps, mapDispatchToProps)(Presentation);
