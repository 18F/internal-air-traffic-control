const React = require('react');
const Base = require('./base');
const Statuses = require('../statuses');

class FlightStatusPicker extends Base {
  _onChange(event) {
    if (typeof this.props.onStatusChange === 'function') {
      Statuses.getAll().some(s => {
        if (s.name === event.target.value) {
          this.props.onStatusChange(s.id);
          return true;
        }
        return false;
      });
    }
  }

  render() {
    return (
      <select value={ this.props.status.toLowerCase() } onChange={ this._onChange } aria-label="Flight status">
        { Statuses.getAll().map(s => <option key={s.id} value={s.name}>{ Statuses.getPrettyName(s) }</option>) }
      </select>
    );
  }
}

module.exports = FlightStatusPicker;
