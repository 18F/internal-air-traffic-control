const React = require("react");
const Flight = require("./flight");
const flightStore = require("../stores/flightStore");

module.exports = React.createClass({
    getInitialState() {
        return {
            flights: flightStore.getFlights()
        };
    },

    componentDidMount() {
        this.flightStoreListenerToken = flightStore.addListener(this._storeChanged);
    },

    componentWillUnmount() {
        this.flightStoreListenerToken.remove();
    },

    _storeChanged() {
        this.setState({ flights: flightStore.getFlights() });
    },

    render() {
        return (
            <div>
                <div className="usa-grid">
                    <h3 className="usa-width-one-whole">Flights on the Board</h3>
                </div>
                { this.state.flights.map(flight => <Flight key={flight.id} flight={flight} />) }
            </div>
        );
    }
});
