import React from 'react';
import Tag from '../containers/flight-tag';

function Flight(props) {
  return (
    <div className="flight">
      <h3>{props.flight.description}</h3>
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
