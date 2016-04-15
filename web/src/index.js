'use strict';
import injectTapEventPlugin from 'react-tap-event-plugin';

// Needed for onTouchTap
// Can go away when react 1.0 release
// Check this repo:
// https://github.com/zilverline/react-tap-event-plugin
injectTapEventPlugin();

const React = require('react');
const ReactDOM = require('react-dom');
import { Provider } from 'react-redux'
import FilterToolbar from './containers/filter-toolbar';
import FlightList from './containers/flight-list';

import { createStore } from 'redux';
import reducers from './reducers';

const store = createStore(reducers, { flights: [ ], statuses: [ ] });

import * as actions from './actions';

io().on('initial', data => {
  store.dispatch(actions.Flights.replaceList(data.flights));
  store.dispatch(actions.Statuses.replaceList(data.statuses));
  store.dispatch(actions.Labels.replaceList(data.labels));
  store.dispatch(actions.Members.replaceList(data.members));
});

io().on('update single flight', flight => {
  store.dispatch(actions.Flights.updateOne(flight));
});

io().on('flight changed', flight => {
  store.dispatch(actions.Flights.replaceOne(flight));
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
