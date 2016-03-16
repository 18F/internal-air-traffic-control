export const Flights = {
  LIST_IN: 'Incoming list of flights',
  ONE_IN: 'Single incoming flight',
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
