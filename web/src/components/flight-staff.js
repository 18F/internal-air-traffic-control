'use strict';
const React = require('react');
const FlightStatus = require('./flight-status');

function getStaff(flight) {
  return flight.staff.join(', ');
}

module.exports = React.createClass({
  render() {
    return (
      <div className='flight-staff'>
        {getStaff(this.props.flight)}
      </div>
    );
  }
});
