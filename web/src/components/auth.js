const React = require("react");
const userStore = require("../stores/userStore");

module.exports = React.createClass({
    getInitialState() {
        return {
            user: userStore.getUser()
        };
    },

    componentDidMount() {
        this.userStoreListenerToken = userStore.addListener(this._storeChanged);
    },

    componentWillUnmount() {
        this.userStoreListenerToken.remove();
    },

    _storeChanged() {
        this.setState({ user: userStore.getUser() });
    },

    render() {
        return (
            <div className="auth-status">
                { this.state.user.loggedIn ? <span className="username">Logged in as <span className="bold">{ this.state.user.user.name }</span></span> : <span className="authButton"><a href="/auth/github">Login with Github</a></span> }
            </div>
        );
    }
});
