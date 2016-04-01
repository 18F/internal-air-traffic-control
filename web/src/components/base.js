const React = require('react');

class Base extends React.Component {
  constructor(props) {
    super(props);

    const methodNames = Object.getOwnPropertyNames(Object.getPrototypeOf(this));
    for (const name of methodNames) {
      if (name !== 'constructor' && typeof this[name] === 'function') {
        this[name] = this[name].bind(this);
      }
    }
  }
}

module.exports = Base;
