const React = require("react");
const Flight = require("./flight");
const ReactSelect = require("react-select");
const flightStore = require("../stores/flightStore");
const localStorage = require("local-storage");

const STORAGE_KEY = "flight-list-visible-statuses";

module.exports = React.createClass({
    getInitialState() {
        return {
            visibleStatuses: false,
            allStatuses: [ ],
            flights: flightStore.getFlights(),
            visibleFlights: [ ]
        };
    },

    componentDidMount() {
        this.flightStoreListenerToken = flightStore.addListener(this._storeChanged);
        let visibleStatusesFromStorage = localStorage(STORAGE_KEY);
        if(visibleStatusesFromStorage) {
            this.setState({ visibleStatuses: visibleStatusesFromStorage, visibleFlights: this.getVisibleFlights(this.state.flights, visibleStatusesFromStorage) });
        }
    },

    componentWillUnmount() {
        this.flightStoreListenerToken.remove();
    },

    getVisibleFlights(flights, visibleStatuses) {
        if(visibleStatuses) {
            const statusNames = visibleStatuses.map(vs => vs.label.toLowerCase());
            console.log(statusNames);
            return flights.filter(f => (statusNames.indexOf(f.status.toLowerCase()) >= 0));
        }
        return [ ];
    },

    _onStatusesChanged(selected) {
        this.setState({ visibleStatuses: selected, visibleFlights: this.getVisibleFlights(this.state.flights, selected) });
        localStorage(STORAGE_KEY, selected);
    },

    _storeChanged() {
        const allStatuses = [ ];
        let visibleStatuses = this.state.visibleStatuses;
        const flights = flightStore.getFlights();

        for(let flight of flights) {
            if(allStatuses.indexOf(flight.status) < 0) {
                allStatuses.push(flight.status);
            }
        }

        if(visibleStatuses === false) {
            visibleStatuses = allStatuses.map(s => { return { value: s, label: s }});
        }

        this.setState({ allStatuses, flights, visibleStatuses, visibleFlights: this.getVisibleFlights(flights, visibleStatuses) });
    },

    render() {
        return (
            <div>
                <div className="usa-grid">
                    <h3 className="usa-width-one-whole">Flights on the Board</h3>
                    <ReactSelect multi={true} value={ this.state.visibleStatuses } delimiter=":" onChange={this._onStatusesChanged} placeholder="Show statuses..." options={ this.state.allStatuses.map(status => { return { value: status, label: status }}) } />
                </div>
                <br/>
                { this.state.visibleFlights.map(flight => <Flight key={flight.id} flight={flight} />) }
            </div>
        );
    }
});
