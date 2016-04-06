import React from 'react';
import Card from 'material-ui/lib/card/card';
import CardHeader from 'material-ui/lib/card/card-header';
import CardText from 'material-ui/lib/card/card-text';
import Divider from 'material-ui/lib/divider';

import Flight from './flight';

class StatusGroup extends React.Component {
  getTags(flight) {
    return flight.labels.map(l => <div className='chip'>{l}</div>);
  }

  getFlights() {
    const nodes = [ ];
    for(let i = 0; i < this.props.flights.length; i++) {
      const flight = this.props.flights[i];
      if(i > 0) {
        nodes.push(<Divider/>);
      }
      nodes.push(
        <div key={flight.id}>
          <h3>{flight.description}</h3>
          <div className='flight-tags'>
            {this.getTags(flight)}
          </div>
        </div>
      );
    }
    return nodes;
  }

  render() {
    return(
      <Card className='status-group' initiallyExpanded={true}>
        <CardHeader
          title={this.props.status.name}
          subtitle={`${this.props.flights.length} projects`}
          className='status-group-header'
          actAsExpander={true}
          showExpandableButton={true}/>
        <CardText expandable={true}>
          {this.getFlights()}
        </CardText>
      </Card>
    );
  }
}

export default StatusGroup;
