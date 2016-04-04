const dispatcher = require('../dispatcher');
import { Store } from 'flux/utils';

/*
const ucfirst = require('ucfirst');
const flightStore = require('./stores/flightStore');

const known = [ ];

let all = [].concat(known);
function getAll() {
  return all;
}

flightStore.addListener(() => {
  const flights = flightStore.getFlights();
  all = [].concat(known);
  for (let flight of flights) {
    let existing = all.filter(f => f.name === flight.status);
    if (existing.length) {
      existing[0].id = flight.listID;
    } else {
      all.push({ name: flight.status, id: flight.listID });
    }
  }
});
//*/

class StatusStore extends Store {
  constructor(d) {
    super(d);
    this._statuses = [ ];
  }

  getStatuses() {
    return this._statuses;
  }

  __onDispatch(event) {
    switch (event.type) {
      case 'statuses-in':
        this._statuses = event.payload;
        this.__emitChange();
        break;

      default:
        break;
    }
  }
}

module.exports = new StatusStore(dispatcher);
