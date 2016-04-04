'use strict';
const React = require('react');
const ReactDOM = require('react-dom');
const Auth = require('./components/auth');
const Message = require('./components/message');
const FlightList = require('./components/flight-list');
const Filters = require('./components/filters');
const service = require('./service');

service.getStatuses();
service.getFlights();
service.getUser();

io().on('flight changed', flight => {
  service.mutateFlight(flight);
});

ReactDOM.render(
  <Auth />,
  document.getElementById('auth')
);

ReactDOM.render(
  <Filters />,
  document.getElementById('filters')
);

ReactDOM.render(
  <Message />,
  document.getElementById('messages')
);

ReactDOM.render(
  <FlightList />,
  document.getElementById('content')
);
