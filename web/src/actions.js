export const Flights = {
  LIST_IN: 'Incoming list of flights',
  ONE_IN: 'Single incoming flight',
  ReplaceList(list) {
    return {
      type: this.LIST_IN,
      list
    };
  },
  ReplaceOne(flight) {
    return {
      type: this.ONE_IN,
      flight
    };
  }
};

export const Statuses = {
  LIST_IN: 'Incoming list of statuses',
  ReplaceList(list) {
    return {
      type: this.LIST_IN,
      list
    };
  }
};

export const User = {
  IN: 'Current user incoming'
};

export const Message = {
  NETWORK_OPS: 'Network operations message',
  ERROR: 'Error message'
};
