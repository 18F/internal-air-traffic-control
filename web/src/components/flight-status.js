const React = require("react");

const statuses = [ "Preflight", "Taxiing", "Climbing", "In flight", "Descent", "Landed", "At the gate", "Complete" ];

function getStatusClassName(status) {
    return status.replace(/ /g, "-").toLowerCase();
}

function getStatusPre(status) {
    const pre = [ ];
    let i = 0;
    while(status !== statuses[i] && i < statuses.length) {
        pre.push(<div className="usa-width-one-twelfth flight-status-done" />);
        i++;
    }
    return pre;
}

function getStatusPost(status) {
    const post = [ ];
    let i = 1;
    while(i < statuses.length) {
        if(status === statuses[i - 1] || post.length > 0) {
            post.push(<div className="usa-width-one-twelfth flight-status-pending" />);
        }
        i++;
    }
    return post;
}

function getPreStyle(status) {
    return { width: `${(statuses.indexOf(status) / statuses.length) * 100}%` };
}

function getPostStyle(status) {
    return { width: `${((statuses.length - statuses.indexOf(status) - 1) / statuses.length) * 100}%` };
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
            </div>
        );
    }
});
