import { connect } from 'react-redux';
import Presentation from '../presentation/flight-tag';

function mapStateToProps(state) {
  const labels = { };
  for (const label of state.labels) {
    labels[label.name] = label;
  }

  return {
    labels
  };
}

function mapDispatchToProps() {
  return { };
}

export default connect(mapStateToProps, mapDispatchToProps)(Presentation);
