'use strict';
import injectTapEventPlugin from 'react-tap-event-plugin';

// Needed for onTouchTap
// Can go away when react 1.0 release
// Check this repo:
// https://github.com/zilverline/react-tap-event-plugin
injectTapEventPlugin();

const React = require('react');
const ReactDOM = require('react-dom');
const socketMessages = require('../../server/socket-messages.js');
import { Provider } from 'react-redux'
import FilterToolbar from './containers/filter-toolbar';
import FlightList from './containers/flight-list';

import { createStore } from 'redux';
import reducers from './reducers';

const store = createStore(reducers, { flights: [ ], statuses: [ ] });

import * as actions from './actions';

io().on(socketMessages.initialize, data => {
  store.dispatch(actions.Flights.replaceList(data.flights));
  store.dispatch(actions.Statuses.replaceList(data.statuses));
  store.dispatch(actions.Labels.replaceList(data.labels));
  store.dispatch(actions.Members.replaceList(data.members));
});

io().on(socketMessages.updateOneFlight, flight => {
  store.dispatch(actions.Flights.updateOne(flight));
});

io().on(socketMessages.addMemberToFlight, data => {
  store.dispatch(actions.Flights.addMemberToFlight(data));
});

io().on(socketMessages.removeMemberFromFlight, data => {
  store.dispatch(actions.Flights.removeMemberFromFlight(data));
});

io().on(socketMessages.addLabelToFlight, data => {
  store.dispatch(actions.Flights.addLabelToFlight(data));
});

io().on(socketMessages.removeLabelFromFlight, data => {
  store.dispatch(actions.Flights.removeLabelFromFlight(data));
});

ReactDOM.render(
  <Provider store={store}>
    <div>
      <FilterToolbar />
      <FlightList />
    </div>
  </Provider>,
  document.getElementById('content')
);
