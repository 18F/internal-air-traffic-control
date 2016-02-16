const React = require("react");
const Statuses = require("../statuses");
const StatusPicker = require("./flight-status-picker");

const statusList = Statuses.list;

function getStatusClassName(status) {
    return `flight-status-${status.replace(/ /g, "-").toLowerCase()}`;
}

function getUnitLength() {
    return 100 / statusList.length;
}

function getPreStyle(status) {
    const i = statusList.indexOf(status.toLowerCase());
    const style = { width: "0%" };
    if(i >= 0) {
        style.width = `${(i / statusList.length) * 100}%`;
    }
    return style;
}

function getPostStyle(status) {
    const i = statusList.indexOf(status.toLowerCase());
    const style = { width: "0%" };
    if(i >= 0) {
        style.width = `${((statusList.length - i - 1) / statusList.length) * 100}%`;
    }
    return style;
}

module.exports = React.createClass({
    _onStatusChange(newStatus) {
        if(typeof this.props.onStatusChange === "function") {
            this.props.onStatusChange(newStatus);
        }
    },

    render() {
        return (
            <div className={ "flight-status-bar " + getStatusClassName(this.props.status) }>
                <div className="flight-status-journey flight-status-journey-done" style={ getPreStyle(this.props.status) }/>
                <div className="flight-status-icon" style={ { width: getUnitLength() + "%" } }>
                    <img className="flight-status-icon" src="images/plane.svg" alt="" />
                </div>
                <div className="flight-status-journey flight-status-journey-pending" style={ getPostStyle(this.props.status) }/>
            </div>
        );
    }
});
