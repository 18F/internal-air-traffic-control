const React = require('react');
const Base = require('./base');
const FlightStatus = require('./flight-status');
const FlightStaff = require('./flight-staff');
const StatusPicker = require('./flight-status-picker');
const service = require('../service');

class Flight extends Base {
  _onStatusChange(newStatusID) {
    const flight = JSON.parse(JSON.stringify(this.props.flight));
    flight.listID = newStatusID;
    service.saveFlight(flight);
  }

  render() {
    return (
      <div className="usa-grid flight">
        <div className="usa-width-one-sixth flight-name">
          {this.props.flight.description}
        </div>
        <div className="usa-width-two-thirds">
          <FlightStatus status={this.props.flight.status} />
          <div className="usa-width-one-whole flight-status-picker">
            <StatusPicker status={ this.props.flight.status } onStatusChange={ this._onStatusChange } />
          </div>
        </div>
        <div className="usa-width-one-sixth">
          <FlightStaff flight={this.props.flight} />
        </div>
      </div>
    );
  }
}

module.exports = Flight;
