'use strict';
const request = require('browser-request');
const dispatcher = require('./dispatcher');

module.exports = {
  getUser() {
    request.get('/api/user', (err, res) => {
      if(!err && res.body) {
        try {
          dispatcher.dispatch({
            type: 'user-in',
            payload: JSON.parse(res.body)
          });
        } catch(e) { }
      }
    });
  },

  getFlights() {
    dispatcher.dispatch({ type: 'network-ops', payload: { error: null, title: 'Fetching flights...' }});
    request.get('/api/flights', (err, res) => {
      if(!err && res.body) {
        try {
          dispatcher.dispatch({ type: 'network-ops', payload: false });
          dispatcher.dispatch({
            type: 'flights-in',
            payload: JSON.parse(res.body)
          });
        } catch(e) {
          dispatcher.dispatch({ type: 'error', payload: { error: 'Invalid flight data', title: 'Error' }});
        }
      } else {
        dispatcher.dispatch({ type: 'error', payload: { error: err.message, title: 'Network error '}});
      }
    });
  },

  saveFlight(flight) {
    dispatcher.dispatch({ type: 'network-ops', payload: { error: null, title: 'Updating flight...' }});
    request.put({ url: '/api/flights', body: flight, json: true }, (err) => {
      if(!err) {
        this.getFlights();
      } else {
        dispatcher.dispatch({ type: 'error', payload: { error: err.message, title: 'Network error '}});
      }
    });
  }
};
