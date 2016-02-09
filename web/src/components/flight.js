const React = require("react");
const FlightStatus = require("./flight-status");
const FlightStaff = require("./flight-staff");

module.exports = React.createClass({
    render() {
        return (
            <div className="usa-grid flight">
                <div className="usa-width-one-sixth">
                    {this.props.flight.name}
                </div>
                <div className="usa-width-two-thirds">
                    <FlightStatus status={this.props.flight.status} />
                </div>
                <div className="usa-width-one-sixth">
                    <FlightStaff flight={this.props.flight} />
                </div>
            </div>
        );
    }
});
