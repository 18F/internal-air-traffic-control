import React from 'react';
import Divider from 'material-ui/lib/divider';
import Tag from '../containers/flight-tag';

class Flight extends React.Component {
  render() {
    return (
      <div>
        <h3>{this.props.flight.description}</h3>
        <div className='flight-tags'>
          {this.props.flight.labels.map(l => <Tag key={l} label={l}/>)}
        </div>
        <Divider/>
      </div>
    );
  }
}

export default Flight;
