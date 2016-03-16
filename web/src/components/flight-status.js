'use strict';
const React = require('react');
const StatusPicker = require('./flight-status-picker');
const statuses = require('../statuses').known;

function getStatusClassName(status) {
  return `flight-status-${status.replace(/ /g, '-').toLowerCase()}`;
}

function getUnitLength() {
  return 100 / statuses.length;
}

function getStatusIndex(statusName) {
  for(let i = 0; i < statuses.length; i++) {
    if(statuses[i].name === statusName.toLowerCase()) {
      return i;
    }
  }
  return -1;
}

function getPreStyle(status) {
  const i = getStatusIndex(status);
  const style = { width: '0%' };
  if(i >= 0) {
    style.width = `${(i / statuses.length) * 100}%`;
  }
  return style;
}

function getPostStyle(status) {
  const i = getStatusIndex(status);
  const style = { width: '0%' };
  if(i >= 0) {
    style.width = `${((statuses.length - i - 1) / statuses.length) * 100}%`;
  }
  return style;
}

module.exports = React.createClass({
  _onStatusChange(newStatus) {
    if(typeof this.props.onStatusChange === 'function') {
      this.props.onStatusChange(newStatus);
    }
  },

  render() {
    return (
      <div className={ 'flight-status-bar ' + getStatusClassName(this.props.status) }>
        <div className='flight-status-journey flight-status-journey-done' style={ getPreStyle(this.props.status) }/>
        <div className='flight-status-icon' style={ { width: getUnitLength() + '%' } }>
          <img className='flight-status-icon' src='images/plane.svg' alt='' />
        </div>
        <div className='flight-status-journey flight-status-journey-pending' style={ getPostStyle(this.props.status) }/>
      </div>
    );
  }
});
