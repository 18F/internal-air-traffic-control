import React from 'react';
import Flight from './flight';

class FlightList extends React.Component {
  render() {
    return(
      <div>
        { this.props.flights.map(f => <Flight key={f.id} flight={f} />) }
      </div>
    );
  }
}

export default FlightList;
