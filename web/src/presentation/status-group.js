import React from 'react';
import Card from 'material-ui/lib/card/card';
import CardHeader from 'material-ui/lib/card/card-header';
import CardText from 'material-ui/lib/card/card-text';
import Flight from './flight';

function StatusGroup(props) {
  return (
    <Card className="status-group usa-width-one-whole" initiallyExpanded>
      <CardHeader title={props.status.name} subtitle={`${props.flights.length} projects`} className="status-group-header" actAsExpander showExpandableButton />
      <CardText expandable>
        {props.flights.map(f => <Flight key={f.id} flight={f} />)}
      </CardText>
    </Card>
  );
}

StatusGroup.propTypes = {
  status: React.PropTypes.object.isRequired,
  flights: React.PropTypes.array.isRequired
};

export default StatusGroup;
