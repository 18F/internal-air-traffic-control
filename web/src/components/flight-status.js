const React = require("react");

const statuses = [ "preflight", "taxiing", "climbing", "in flight", "descent", "landing", "at gate", "complete" ];

function getStatusClassName(status) {
    return status.replace(/ /g, "-").toLowerCase();
}

function getPreStyle(status) {
    if(statuses.indexOf(status.toLowerCase()) >= 0) {
        return { width: `${(statuses.indexOf(status.toLowerCase()) / statuses.length) * 100}%` };
    }
    return { width: "0%" };
}

function getPostStyle(status) {
    if(statuses.indexOf(status.toLowerCase()) >= 0) {
        return { width: `${((statuses.length - statuses.indexOf(status.toLowerCase()) - 1) / statuses.length) * 100}%` };
    }
    return { width: "0%" };
}

module.exports = React.createClass({
    render() {
        return (
            <div className="flight-status-bar usa-width-two-thirds">
                <div className="flight-status-done" style={ getPreStyle(this.props.status) }/>
                <div className="flight-status-icon" style={ { width: "12.5%" } }>
                    <img className={ "flight-status-icon-" + getStatusClassName(this.props.status) } src="images/plane.svg" alt="" />
                </div>
                <div className="flight-status-pending" style={ getPostStyle(this.props.status) }/>
                <div className="flight-status">{ this.props.status }</div>
            </div>
        );
    }
});
