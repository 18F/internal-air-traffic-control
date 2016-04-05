import React from 'react';
import Card from 'material-ui/lib/card/card';
import CardHeader from 'material-ui/lib/card/card-header';
import CardText from 'material-ui/lib/card/card-text';
import Divider from 'material-ui/lib/divider';

import Flight from './flight';

class Status extends React.Component {
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
          <ul>
            {this.props.flights.map(f => <li>{f.description}</li> )}
          </ul>
        </CardText>
      </Card>
    );
  }
}

export default Status;
