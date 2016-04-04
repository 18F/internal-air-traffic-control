const dispatcher = require('../dispatcher');
import { Store } from 'flux/utils';
import updeep from 'updeep';

class FlightStore extends Store {
  constructor(d) {
    super(d);
    this._flights = [];
  }

  getFlights() {
    return this._flights;
  }

  __onDispatch(event) {
    switch (event.type) {
      case 'flights-in':
        this._flights = event.payload;
        this.__emitChange();
        break;

      case 'flight-update':
        for (let i = 0; i < this._flights.length; i++) {
          if (this._flights[i].id === event.payload.id) {
            const update = { };
            update[i] = event.payload;
            const status = require('../stores/statusStore').getStatuses().filter(s => s.id === event.payload.listID);
            if (status.length) {
              update[i].status = status[0].name;
            }
            this._flights = updeep(update, this._flights);
            break;
          }
        }
        this.__emitChange();
        break;

      default:
        break;
    }
  }
}

module.exports = new FlightStore(dispatcher);
