'use strict';
const dispatcher = require('../dispatcher');
import { Store } from 'flux/utils';

class UserStore extends Store {
  constructor(dispatcher) {
    super(dispatcher);
    this._user = { };
  }

  getUser() {
    return this._user;
  }

  __onDispatch(event) {
    switch(event.type) {
      case 'user-in':
        this._user = event.payload;
        this.__emitChange();
        break;
    }
  }
}

module.exports = new UserStore(dispatcher);
