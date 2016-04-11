export const Flights = {
  LIST_IN: 'Incoming list of flights',
  ONE_IN: 'Single incoming flight',

  ReplaceList(list) {
    return { type: this.LIST_IN, list };
  },
  ReplaceOne(flight) {
    return { type: this.ONE_IN, flight };
  }
};

export const Statuses = {
  LIST_IN: 'Incoming list of statuses',

  ReplaceList(list) {
    return { type: this.LIST_IN, list };
  }
};

export const Filter = {
  ADD_STATUS: 'Add status to the filter',
  REMOVE_STATUS: 'Remove status from the filter',
  ADD_LABEL: 'Add label to the filter',
  REMOVE_LABEL: 'Remove label from the filter',
  ADD_USER: 'Add user to the filter',
  REMOVE_USER: 'Remove user from the filter',
  ADD_LABEL: 'Add label to the filter',
  REMOVE_LABEL: 'Remove label from the filter',
  CHANGE_TEXT: 'Change filter text',

  AddStatus(status) {
    return { type: Filter.ADD_STATUS, status };
  },
  RemoveStatus(status) {
    return { type: Filter.REMOVE_STATUS, status };
  },

  AddLabel(label) {
    return { type: Filter.ADD_LABEL, label };
  },
  RemoveLabel(label) {
    return { type: Filter.REMOVE_LABEL, label };
  },

  AddUser(user) {
    return { type: Filter.ADD_USER, user };
  },
  RemoveUser(user) {
    return { type: Filter.REMOVE_USER, user };
  },

  ChangeText(text) {
    return { type: Filter.CHANGE_TEXT, text };
  }
};

export const Members = {
  LIST_IN: 'Incoming list of members',

  ReplaceList(list) {
    return { type: this.LIST_IN, list };
  }
};

export const Labels = {
  LIST_IN: 'Incoming list of labels',

  ReplaceList(list) {
    return { type: this.LIST_IN, list };
  }
};

export const User = {
  IN: 'Current user incoming'
};

export const Message = {
  NETWORK_OPS: 'Network operations message',
  ERROR: 'Error message'
};
