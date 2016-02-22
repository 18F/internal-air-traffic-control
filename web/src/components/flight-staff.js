'use strict';
const React = require('react');
const FlightStatus = require('./flight-status');

function getStaff(flight) {
  let staff = [ ];
  if(flight.pair) {
    staff.push(flight.pair);
  }
  staff = staff.concat(flight.staff);

  return (staff.length > 0 ? ', ' : '') + staff.join(', ');
}

module.exports = React.createClass({
  render() {
    return (
      <div className='flight-staff'>
        <span className='flight-leader'>{this.props.flight.lead}</span>
        {getStaff(this.props.flight)}
      </div>
    );
  }
});
