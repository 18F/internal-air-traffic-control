const React = require('react');
const Base = require('./base');
const Flight = require('./flight');
const StatusGraph = require('./status-step-graph');
const ReactSelect = require('react-select');
const flightStore = require('../stores/flightStore');
const localStorage = require('local-storage');

const statuses = require('../statuses');
const STORAGE_KEY = 'flight-list-visible-statuses';

function getAllStatusObjects() {
  return statuses.getAll().map(s => ({ value: s, label: s.name }));
}

class FlightList extends Base {
  constructor(props) {
    super(props);
    this.state = {
      visibleStatuses: localStorage(STORAGE_KEY),
      flights: flightStore.getFlights(),
      visibleFlights: [],
      searchField: ''
    };
  }

  componentDidMount() {
    this.flightStoreListenerToken = flightStore.addListener(this._storeChanged);
  }

  componentWillUnmount() {
    this.flightStoreListenerToken.remove();
  }

  getVisibleFlights(flights, visibleStatuses, searchText = '') {
    let visibleFlights = flights.slice(0);
    if (visibleStatuses && visibleStatuses.length) {
      const statusNames = visibleStatuses.map(vs => vs.value);
      visibleFlights = flights.filter(f =>
        statusNames.some(s => s.name === f.status)
      );
    }

    const majorSearchProperties = ['description', 'status', 'lead', 'pair'];

    const cleanSearchText = searchText.trim().toLowerCase();
    if (visibleFlights.length && cleanSearchText.length) {
      const terms = cleanSearchText.split(' ');
      visibleFlights = visibleFlights.filter(flight => {
        for (const term of terms) {
          for (const property of majorSearchProperties) {
            if (flight[property].toLowerCase().indexOf(term) >= 0) {
              return true;
            }
          }
          for (const staff of flight.staff) {
            if (staff.toLowerCase().indexOf(term) >= 0) {
              return true;
            }
          }
        }
        return false;
      });
    }
    return visibleFlights;
  }

  _onSearchChanged(event) {
    this.setState({ searchField: event.target.value, visibleFlights: this.getVisibleFlights(this.state.flights, this.state.visibleStatuses, event.target.value) });
  }

  _onStatusesChanged(selected) {
    this.setState({ visibleStatuses: selected, visibleFlights: this.getVisibleFlights(this.state.flights, selected, this.state.searchField) });
    localStorage(STORAGE_KEY, selected);
  }

  _storeChanged() {
    const flights = flightStore.getFlights();
    let visibleStatuses = this.state.visibleStatuses;

    if (visibleStatuses === false) {
      visibleStatuses = getAllStatusObjects();
    }

    this.setState({ flights, visibleStatuses, visibleFlights: this.getVisibleFlights(flights, visibleStatuses, this.state.searchField) });
  }

  render() {
    return (
      <div>
        <div className="usa-grid">
          <h3 className="usa-width-one-whole">Flights on the Board</h3>
          <StatusGraph className="usa-width-one-whole"/>
          <ReactSelect className="usa-width-three-fourths" multi value={ this.state.visibleStatuses } delimiter=":" onChange={this._onStatusesChanged} placeholder="Show statuses..." options={ getAllStatusObjects() } />
          <div className="usa-width-one-fourth flight-list-search">
            <input type="text" onChange={ this._onSearchChanged } placeholder="Filter..." aria-label="Flight filter" />
          </div>
        </div>
        <br />
        { this.state.visibleFlights.map(flight => <Flight key={flight._id} flight={flight} />) }
      </div>
    );
  }
}

module.exports = FlightList;
