const React = require('react');
const Base = require('./base');
const userStore = require('../stores/userStore');

class Auth extends Base {
  constructor(props) {
    super(props);
    this.state = {
      user: userStore.getUser()
    };
  }

  componentDidMount() {
    this.userStoreListenerToken = userStore.addListener(this._storeChanged.bind(this));
  }

  componentWillUnmount() {
    this.userStoreListenerToken.remove();
  }

  _storeChanged() {
    this.setState({ user: userStore.getUser() });
  }

  render() {
    return (
      <a className="usa-button auth-status" href={ this.state.user.loggedIn ? '#' : '/auth/trello' }>
        { this.state.user.loggedIn ? `Logged In (${this.state.user.user.name})` : 'Login with Trello' }
      </a>
    );
  }
}

module.exports = Auth;
