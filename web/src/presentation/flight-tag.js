import React from 'react';

class FlightTag extends React.Component {
  render() {
    let color = '';
    if(this.props.labels[this.props.label]) {
      color = this.props.labels[this.props.label].color;
    }

    return (
      <div className={`chip ${color}`}>{this.props.label}</div>
    );
  }
}

export default FlightTag;
