import React from 'react';
import Divider from 'material-ui/lib/divider';
import Tag from '../containers/flight-tag';

function Flight(props) {
  return (
    <div>
      <h3>{props.flight.description}</h3>
      <div className="flight-tags">
        {props.flight.labels.map(l => <Tag key={l} label={l} />)}
      </div>
      <Divider />
    </div>
  );
}

Flight.propTypes = {
  flight: React.PropTypes.object
};

export default Flight;
