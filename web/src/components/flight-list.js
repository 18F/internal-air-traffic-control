const React = require("react");
const Flight = require("./flight");
const ReactSelect = require("react-select");
const flightStore = require("../stores/flightStore");
const localStorage = require("local-storage");

const statuses = require("../statuses");
const STORAGE_KEY = "flight-list-visible-statuses";

module.exports = React.createClass({
    getInitialState() {
        return {
            visibleStatuses: false,
            flights: flightStore.getFlights(),
            visibleFlights: [ ],
            searchField: ""
        };
    },

    componentDidMount() {
        this.flightStoreListenerToken = flightStore.addListener(this._storeChanged);
        let visibleStatusesFromStorage = localStorage(STORAGE_KEY);
        if(visibleStatusesFromStorage) {
            this.setState({ visibleStatuses: visibleStatusesFromStorage, visibleFlights: this.getVisibleFlights(this.state.flights, visibleStatusesFromStorage, this.state.searchField) });
        }
    },

    componentWillUnmount() {
        this.flightStoreListenerToken.remove();
    },

    getVisibleFlights(flights, visibleStatuses, searchText) {
        let visibleFlights = [ ];
        if(visibleStatuses) {
            const statusNames = visibleStatuses.map(vs => vs.label.toLowerCase());
            return flights.filter(f => (statusNames.indexOf(f.status.toLowerCase()) >= 0));
        }

        const majorSearchProperties = [ "description", "status", "lead", "pair" ];

        searchText = searchText.trim().toLowerCase();
        if(visibleFlights.length && searchText.trim()) {
            let terms = searchText.split(" ");
            visibleFlights = visibleFlights.filter(flight => {
                for(let term of terms) {
                    for(let property of majorSearchProperties) {
                        if(flight[property].toLowerCase().indexOf(term) >= 0) {
                            return true;
                        }
                    }
                    for(let staff of flight.staff) {
                        if(staff.toLowerCase().indexOf(term) >= 0) {
                            return true;
                        }
                    }
                }
                return false;
            });
        }

        return visibleFlights;
    },

    _onSearchChanged(event) {
        this.setState({ searchField: event.target.value, visibleFlights: this.getVisibleFlights(this.state.flights, this.state.visibleStatuses, event.target.value) });
    },

    _onStatusesChanged(selected) {
        this.setState({ visibleStatuses: selected, visibleFlights: this.getVisibleFlights(this.state.flights, selected, this.state.searchField) });
        localStorage(STORAGE_KEY, selected);
    },

    _storeChanged() {
        let visibleStatuses = this.state.visibleStatuses;

        if(visibleStatuses === false) {
            visibleStatuses = statuses.getAll().map(s => { return { value: s, label: s }});
        }

        this.setState({ flights, visibleStatuses, visibleFlights: this.getVisibleFlights(flights, visibleStatuses) });
    },

    render() {
        return (
            <div>
                <div className="usa-grid">
                    <h3 className="usa-width-one-whole">Flights on the Board</h3>
                    <ReactSelect multi={true} value={ this.state.visibleStatuses } delimiter=":" onChange={this._onStatusesChanged} placeholder="Show statuses..." options={ statuses.getAll().map(status => { return { value: status, label: status }}) } />
                </div>
                <br/>
                { this.state.visibleFlights.map(flight => <Flight key={flight.id} flight={flight} />) }
            </div>
        );
    }
});
