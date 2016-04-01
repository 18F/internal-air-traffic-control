const ucfirst = require('ucfirst');
const flightStore = require('./stores/flightStore');

const known = [
  { name: 'grounded', id: 0 },
  { name: 'tarmac', id: 0 },
  { name: 'preflight', id: 0 },
  { name: 'taxiing', id: 0 },
  { name: 'climbing', id: 0 },
  { name: 'in flight', id: 0 },
  { name: 'landing', id: 0 },
  { name: 'landed', id: 0 },
  { name: 'at gate', id: 0 },
  { name: 'autopilot', id: 0 },
];

let all = [].concat(known);
function getAll() {
  return all;
}

flightStore.addListener(() => {
  const flights = flightStore.getFlights();
  all = [].concat(known);
  for (let flight of flights) {
    let existing = all.filter(f => f.name === flight.status.toLowerCase());
    if (existing.length) {
      existing[0].id = flight.listID;
    } else {
      all.push({ name: flight.status.toLowerCase(), id: flight.listID });
    }
  }
});

module.exports = {
  known,
  getAll,
  getPrettyName(status) {
    const parts = status.name.split(' ');
    for (let i = 0; i < parts.length; i++) {
      parts[i] = ucfirst(parts[i]);
    }
    return parts.join(' ');
  }
};
