const React = require('react');
const Base = require('./base');
const statusStore = require('../stores/statusStore');

class FlightStatusPicker extends Base {
  _onChange(event) {
    if (typeof this.props.onStatusChange === 'function') {
      statusStore.getStatuses().some(s => {
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
      <select value={ this.props.status } onChange={ this._onChange } aria-label="Flight status">
        { statusStore.getStatuses().map(s => <option key={s.id} value={s.name}>{ s.name }</option>) }
      </select>
    );
  }
}

module.exports = FlightStatusPicker;
