const React = require("react");
const FlightStatus = require("./flight-status");
const FlightStaff = require("./flight-staff");

module.exports = React.createClass({
    render() {
        return (
            <div className="usa-grid flight">
                <div className="usa-width-one-sixth flight-name">
                    {this.props.flight.description}
                </div>
                <FlightStatus status={this.props.flight.status} />
                <div className="usa-width-one-sixth">
                    <FlightStaff flight={this.props.flight} />
                </div>
            </div>
        );
    }
});
