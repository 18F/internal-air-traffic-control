const ucfirst = require("ucfirst");
const flightStore = require("./stores/flightStore");

const known = [
    "preflight",
    "taxiing",
    "climbing",
    "in flight",
    "landing",
    "landed",
    "at gate",
    "complete"
];

let all = [ ].concat(known);
function getAll() {
    return all;
}

flightStore.addListener(() => {
    const flights = flightStore.getFlights();
    all = [ ].concat(known);
    for(let flight of flights) {
        if(all.indexOf(flight.status.toLowerCase()) < 0) {
            all.push(flight.status.toLowerCase());
        }
    }
});

module.exports = {
    known,
    getAll,
    getPrettyName(status) {
        const parts = status.split(" ");
        for(let i = 0; i < parts.length; i++) {
            parts[i] = ucfirst(parts[i]);
        }
        return parts.join(" ");
    }
};
