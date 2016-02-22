'use strict';
const React = require('react');
const messageStore = require('../stores/messageStore');

module.exports = React.createClass({
  getInitialState() {
    return {
      visible: false,
      type: 'info',
      title: '',
      message: ''
    }
  },

  componentDidMount() {
    this.messageStoreListenerToken = messageStore.addListener(this._storeChanged);
  },

  componentWillUnmount() {
    this.messageStoreListenerToken.remove();
  },

  _close() {
    this.setState({ visible: false });
  },

  _storeChanged() {
    const message = messageStore.getMessage();
    const visible = (message.title.length > 0);

    // If there's already a pending message text change, cancel
    // it now, or else get weird behavior.
    clearTimeout(this.messageChangeTimeout);

    // If the message is becoming visible (or is already visible),
    // just update everything immediately.
    if(visible) {
      this.setState({ visible, title: message.title, message: message.error, type: (message.error ? 'error' : 'info') });
    } else {
      // If the message is being hidden, only change the visibility
      // first.  Wait until after the visibility animation has
      // finished before changing the text.
      this.setState({ visible });
      this.messageChangeTimeout = setTimeout(() => {
        this.setState({ title: message.title, message: message.error, type: (message.error ? 'error' : 'info') });
      }, 500);
    }
  },

  render() {
    return (
      <div className={ `usa-alert usa-alert-${this.state.type} alert-${this.state.visible ? 'visible' : 'hidden'}` }>
        <div className='usa-alert-body'>
          <h3 className='usa-alert-heading'>{ this.state.title }</h3>
          { this.state.message ? <p className='usa-alert-text'>{ this.state.message }<br/><a onClick={ this._close }>Close</a></p> : null }
        </div>
      </div>
    );
  }
});
