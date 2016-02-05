const React = require("react");

function getStaff(flight) {
    let staff = [ ];
    if(flight.pair) {
        staff.push(flight.pair);
    }
    staff = staff.concat(flight.staff);

    return (staff.length > 0 ? ", " : "") + staff.join(", ");
}

function getStatusClassName(flight) {
    return flight.status.replace(/ /g, "-").toLowerCase();
}

module.exports = React.createClass({
    render() {
        return (
            <div className="usa-grid flight">
                <div className="usa-width-one-sixth">
                    {this.props.flight.name}
                </div>
                <div className="flight-status usa-width-two-thirds">
                    <img className={"flight-status-icon " + getStatusClassName(this.props.flight)} src="images/plane.svg" />
                    <div className="flight-status-name">{this.props.flight.status}</div>
                    <div className={"flight-status-progress " + getStatusClassName(this.props.flight)} />
                </div>
                <div className="usa-width-one-sixth flight-staff">
                    <span className="flight-leader">{this.props.flight.lead}</span>
                    {getStaff(this.props.flight)}
                </div>
            </div>
        );
    }
});
