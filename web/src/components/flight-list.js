const React = require("react");
const Flight = require("./flight");
const ReactSelect = require("react-select");
const flightStore = require("../stores/flightStore");

module.exports = React.createClass({
    getInitialState() {
        return {
            visibleStatuses: false,
            allStatuses: [ ],
            flights: flightStore.getFlights()
        };
    },

    componentDidMount() {
        this.flightStoreListenerToken = flightStore.addListener(this._storeChanged);
    },

    componentWillUnmount() {
        this.flightStoreListenerToken.remove();
    },

    statusesChanged(selected) {
        this.setState({ visibleStatuses: selected });
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

        this.setState({ allStatuses, flights, visibleStatuses });
    },

    render() {
        return (
            <div>
                <div className="usa-grid">
                    <h3 className="usa-width-one-whole">Flights on the Board</h3>
                    <ReactSelect multi={true} value={ this.state.visibleStatuses } delimiter=":" onChange={this.statusesChanged} placeholder="Show statuses..." options={ this.state.allStatuses.map(status => { return { value: status, label: status }}) } />
                </div>
                <br/>
                { this.state.flights.map(flight => <Flight key={flight.id} flight={flight} />) }
            </div>
        );
    }
});
