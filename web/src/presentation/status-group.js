import React from 'react';
import Card from 'material-ui/lib/card/card';
import CardHeader from 'material-ui/lib/card/card-header';
import CardText from 'material-ui/lib/card/card-text';
import Flight from './flight';

class StatusGroup extends React.Component {
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
          {this.props.flights.map(f => <Flight key={f.id} flight={f} />)}
        </CardText>
      </Card>
    );
  }
}

export default StatusGroup;
