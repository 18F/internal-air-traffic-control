const React = require("react");

function getStatusClassName(status) {
    return status.replace(/ /g, "-").toLowerCase();
}

module.exports = React.createClass({
    render() {
        return (
            <div className="flight-status">
                <img className={"flight-status-icon " + getStatusClassName(this.props.status)} src="images/plane.svg" />
                <div className="flight-status-name">{this.props.status}</div>
                <div className={"flight-status-progress " + getStatusClassName(this.props.status)} />
            </div>
        );
    }
});
