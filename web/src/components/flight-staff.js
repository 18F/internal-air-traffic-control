const React = require('react');
const Base = require('./base');

class FlightStaff extends Base {
  getStaff(flight) {
    return flight.staff.join(', ');
  }

  render() {
    return (
      <div className="flight-staff">
        {this.getStaff(this.props.flight)}
      </div>
    );
  }
}

module.exports = FlightStaff;
