import React from 'react';

function FlightTag(props) {
  let color = '';
  if (props.labels[props.label]) {
    color = props.labels[props.label].color;
  }

  return (
    <div className={`chip ${color}`}>{props.label}</div>
  );
}

FlightTag.propTypes = {
  labels: React.PropTypes.object.isRequired,
  label: React.PropTypes.string.isRequired
};

export default FlightTag;
