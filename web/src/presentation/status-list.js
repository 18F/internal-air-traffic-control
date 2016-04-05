import React from 'react';
import Status from './status';

class StatusList extends React.Component {
  render() {
    return(
      <div className='status-list usa-grid'>
        {this.props.statuses.map(s => <Status className='usa-grid-one-whole' key={s.id} status={s} flights={this.props.flights.filter(f => f.status === s.name)} />)}
      </div>
    );
  }
}

export default StatusList;
