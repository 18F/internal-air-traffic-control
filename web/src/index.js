'use strict';
const React = require('react');
const ReactDOM = require('react-dom');
const Auth = require('./components/auth');
const Message = require('./components/message');
const FlightList = require('./components/flight-list');
const service = require('./service');

import { createStore } from 'redux';
import reducers from './reducers';

const store = createStore(reducers, { flights: [ ] });

import * as actions from './actions';
const act = actions.Flights.ReplaceList([ 'asdf' ]);
store.dispatch(act);

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
