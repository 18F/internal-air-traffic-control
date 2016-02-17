const dispatcher = require("../dispatcher");
import { Store } from "flux/utils";

class MessageStore extends Store {
    constructor(dispatcher) {
        super(dispatcher);
        this._message = { error: null, title: "" };
    }

    getMessage() {
        return this._message;
    }

    __onDispatch(event) {
        switch(event.type) {
            case "network-ops":
            case "error":
                this._message = event.payload;
                if(!this._message) {
                    this._message = { error: null, title: "" };
                }
                this.__emitChange();
                break;
        }
    }
}

module.exports = new MessageStore(dispatcher);
