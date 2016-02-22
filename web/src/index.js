'use strict';
const React = require('react');
const ReactDOM = require('react-dom');
const Auth = require('./components/auth');
const Message = require('./components/message');
const FlightList = require('./components/flight-list');
const service = require('./service');

service.getFlights();
service.getUser();

io().on('flights changed', () => service.getFlights());

ReactDOM.render(
  <Auth/>,
  document.getElementById('auth')
);

ReactDOM.render(
  <Message/>,
  document.getElementById('messages')
);

ReactDOM.render(
  <FlightList/>,
  document.getElementById('content')
);
