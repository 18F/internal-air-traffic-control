function getVisibleFlights(state) {
  let filtered = state.flights.filter(flight => {
    if (state.filter.statuses.length === 0 || state.filter.statuses.indexOf(flight.status) >= 0) {
      return true;
    }
    return false;
  });

  filtered = filtered.filter(flight => {
    if (state.filter.labels.length === 0) {
      return true;
    }
    for (const label of state.filter.labels) {
      if (flight.labels.indexOf(label) >= 0) {
        return true;
      }
    }
    return false;
  });

  filtered = filtered.filter(flight => {
    if (state.filter.users.length === 0) {
      return true;
    }
    for (const user of state.filter.users) {
      if (flight.staff.some(s => s.name === user)) {
        return true;
      }
    }
    return false;
  });

  const filterTerms = state.filter.text.trim().toLowerCase().split(' ');
  filtered = filtered.filter(flight => {
    if (filterTerms.length === 0) {
      return true;
    }

    for (const term of filterTerms) {
      if (flight.description.toLowerCase().indexOf(term) >= 0) {
        return true;
      }
      if (flight.status.toLowerCase().indexOf(term) >= 0) {
        return true;
      }
      for (const staff of flight.staff) {
        if (staff.name.toLowerCase().indexOf(term) >= 0) {
          return true;
        }
      }
      for (const label of flight.labels) {
        if (label.toLowerCase().indexOf(term) >= 0) {
          return true;
        }
      }
    }

    return false;
  });

  return filtered;
}

export default function visibleFlights(state) {
  const newState = state;
  newState.visibleFlights = getVisibleFlights(newState);
  return newState;
}
