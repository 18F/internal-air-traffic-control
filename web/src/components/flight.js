'use strict';
const React = require('react');
const FlightStatus = require('./flight-status');
const FlightStaff = require('./flight-staff');
const StatusPicker = require('./flight-status-picker');
const service = require('../service');

module.exports = React.createClass({
  _onStatusChange(newStatus) {
    let flight = JSON.parse(JSON.stringify(this.props.flight));
    flight.status = newStatus;
    service.saveFlight(flight);

  /*if(newStatus === 'In Flight' && flight.description.match(/(^|\W)bpa($|\W)/i) /* && not-already-a-trello-card* /) {
      setTimeout(() => {
        if(window.confirm('Create a BPA Trello card for this project?')) {
          console.log("Create a card!");
        }
      }, 10);
    }*/
  },

  _getTrelloLink(flight) {
    if(flight.status === 'In Flight' && flight.description.match(/(^|\W)bpa($|\W)/i)) {
      if(true) { // flight does not have trello card
        return (
          <span>Create Trello Card</span>
        )
      } else {
        // does already, so link it
      }
    } else {
      return null;
    }
  },

  render() {
    return (
      <div className='usa-grid flight'>
        <div className='usa-width-one-sixth flight-name'>
          {this.props.flight.description}
        </div>
        <div className='usa-width-two-thirds'>
          <FlightStatus status={this.props.flight.status} onStatusChange={ this._onStatusChange }/>
          <div className='usa-width-one-whole flight-status-picker'>
            <StatusPicker status={ this.props.flight.status } onStatusChange={ this._onStatusChange }/>
          </div>
          <div className='usa-width-one-whole'>
            { this._getTrelloLink(this.props.flight) }
          </div>
        </div>
        <div className='usa-width-one-sixth'>
          <FlightStaff flight={this.props.flight} />
        </div>
      </div>
    );
  }
});
