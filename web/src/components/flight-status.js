const React = require("react");

const statuses = [ "preflight", "taxiing", "climbing", "in flight", "descent", "landing", "at gate", "complete" ];

function getStatusClassName(status) {
    return `flight-status-${status.replace(/ /g, "-").toLowerCase()}`;
}

function getPreStyle(status) {
    const i = statuses.indexOf(status.toLowerCase());
    const style = { width: "0%" };
    if(i >= 0) {
        style.width = `${(i / statuses.length) * 100}%`;
    }
    return style;
}

function getPostStyle(status) {
    const i = statuses.indexOf(status.toLowerCase());
    const style = { width: "0%" };
    if(i >= 0) {
        style.width = `${((statuses.length - i - 1) / statuses.length) * 100}%`;
    }
    return style;
}

module.exports = React.createClass({
    render() {
        return (
            <div className={ "flight-status-bar usa-width-two-thirds " + getStatusClassName(this.props.status) }>
                <div className="flight-status-journey flight-status-journey-done" style={ getPreStyle(this.props.status) }/>
                <div className="flight-status-icon" style={ { width: "12.5%" } }>
                    <img className="flight-status-icon" src="images/plane.svg" alt="" />
                </div>
                <div className="flight-status-journey flight-status-journey-pending" style={ getPostStyle(this.props.status) }/>
                <div className="flight-status">{ this.props.status }</div>
            </div>
        );
    }
});
