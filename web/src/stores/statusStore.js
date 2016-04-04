const dispatcher = require('../dispatcher');
import { Store } from 'flux/utils';

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
