const React = require('react');
const Base = require('./base');
const statuses = require('../statuses').known;

class FlightStatus extends Base {
  getStatusClassName(status) {
    return `flight-status-${status.replace(/ /g, '-').toLowerCase()}`;
  }

  getUnitLength() {
    return 100 / statuses.length;
  }

  getStatusIndex(statusName) {
    for (let i = 0; i < statuses.length; i++) {
      if (statuses[i].name === statusName.toLowerCase()) {
        return i;
      }
    }
    return -1;
  }

  getPreStyle(status) {
    const i = this.getStatusIndex(status);
    const style = { width: '0%' };
    if (i >= 0) {
      style.width = `${(i / statuses.length) * 100}%`;
    }
    return style;
  }

  getPostStyle(status) {
    const i = this.getStatusIndex(status);
    const style = { width: '0%' };
    if (i >= 0) {
      style.width = `${((statuses.length - i - 1) / statuses.length) * 100}%`;
    }
    return style;
  }

  render() {
    return (
      <div className={ `flight-status-bar ${this.getStatusClassName(this.props.status)}` }>
        <div className="flight-status-journey flight-status-journey-done" style={ this.getPreStyle(this.props.status) } />
        <div className="flight-status-icon" style={ { width: `${this.getUnitLength()}%` } }>
          <img className="flight-status-icon" src="images/plane.svg" alt="" />
        </div>
        <div className="flight-status-journey flight-status-journey-pending" style={ this.getPostStyle(this.props.status) } />
      </div>
    );
  }
}

module.exports = FlightStatus;
