import React from 'react';
import StatusGroup from '../containers/status-group';

function FlightList(props) {
  return (
    <div>
      {props.statuses.map(s => <StatusGroup key={s.id} status={s} />)}
    </div>
  );
}

FlightList.propTypes = {
  statuses: React.PropTypes.array.isRequired
};

export default FlightList;
