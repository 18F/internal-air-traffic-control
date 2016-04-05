import React from 'react';
import Card from 'material-ui/lib/card/card';
import CardHeader from 'material-ui/lib/card/card-header';
import CardText from 'material-ui/lib/card/card-text';
import Flight from './flight';

class Status extends React.Component {
  render() {
    return(
      <Card className='status-card'>
        <CardHeader title={this.props.status.name} subtitle={`${this.props.flights.length} projects`} actAsExpander={true} showExpandableButton={true} />
        <CardText expandable={true}>
          {this.props.flights.map(f => <Flight key={f.id} flight={f} />)}
        </CardText>
      </Card>
    );
  }
}

export default Status;
