const ucfirst = require('ucfirst');
const flightStore = require('./stores/flightStore');

const known = [ ];

let all = [].concat(known);
function getAll() {
  return all;
}

flightStore.addListener(() => {
  const flights = flightStore.getFlights();
  all = [].concat(known);
  for (let flight of flights) {
    let existing = all.filter(f => f.name === flight.status);
    if (existing.length) {
      existing[0].id = flight.listID;
    } else {
      all.push({ name: flight.status, id: flight.listID });
    }
  }
});

module.exports = {
  known,
  getAll
};
