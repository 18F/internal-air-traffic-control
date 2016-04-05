import React from 'react';
import Flight from './flight';
import StatusGroup from '../containers/status-group';

class FlightList extends React.Component {
  render() {
    return(
      <div>
        {this.props.statuses.map(s => <StatusGroup key={s.id} status={s} />)}
      </div>
    );
  }
}

export default FlightList;
