'use strict';
const dispatcher = require('../dispatcher');
import { Store } from 'flux/utils';

class FlightStore extends Store {
  constructor(dispatcher) {
    super(dispatcher);
    this._flights = [ ];
  }

  getFlights() {
    return this._flights;
  }

  __onDispatch(event) {
    switch(event.type) {
      case 'flights-in':
        this._flights = event.payload;
        this.__emitChange();
        break;
    }
  }
}

module.exports = new FlightStore(dispatcher);
