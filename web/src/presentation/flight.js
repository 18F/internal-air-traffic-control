import React from 'react';
import Dashboard from 'material-ui/lib/svg-icons/action/dashboard';
import Tag from '../containers/flight-tag';

function Flight(props) {
  return (
    <div className={`flight ${props.className}`}>
      <h3>{props.flight.description} <a href={props.flight.trelloURL}><span className="anchor-description">Trello card for {props.flight.description}</span><Dashboard /></a></h3>
      <div className="flight-tags">
        {props.flight.labels.map(l => <Tag key={l} label={l} />)}
      </div>
      <div className="member-tags">
        {props.flight.staff.map(s => <Tag key={s.name} label={s.name} avatar={s.avatar} />)}
      </div>
      <hr />
    </div>
  );
}

Flight.propTypes = {
  flight: React.PropTypes.object
};

export default Flight;
