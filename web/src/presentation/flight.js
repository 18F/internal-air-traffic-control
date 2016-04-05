import React from 'react';

class Flight extends React.Component {
  render() {
    return (
      <div>{this.props.flight.description}</div>
    );
  }
}

export default Flight;
