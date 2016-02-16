const React = require("react");
const Statuses = require("../statuses");

module.exports = React.createClass({
    _onChange(event) {
        if(typeof this.props.onStatusChange === "function") {
            this.props.onStatusChange(Statuses.getPrettyName(event.target.value));
        }
    },

    render() {
        return (
            <select value={ this.props.status.toLowerCase() } onChange={ this._onChange }>
                { Statuses.getAll().map(s => <option key={s} value={s}>{ Statuses.getPrettyName(s) }</option>) }
            </select>
        )
    }
});
