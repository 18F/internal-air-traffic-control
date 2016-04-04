const React = require('react');
const Base = require('./base');
const flightStore = require('../stores/flightStore');
const statuses = require('../statuses');
const c3 = require('c3');

let number = 0;
class StatusStepGraph extends Base {
  constructor(props) {
    super(props);
    this.chart = null;
    this.id = "flight-status-chart-" + (number++);

    this.className = "status-step-graph";
    if(props.className) {
      this.className += " " + props.className;
    }
  }

  componentDidMount() {
    this.flightStoreListenerToken = flightStore.addListener(this._storeChanged);
    this.chart = c3.generate({
      bindto: "#" + this.id,
      data: {
        json: [ ],
        types: { 'Flights': 'area-step' },
        labels: true
      },
      axis: {
        x: {
          type: 'category'
        }
      },
      legend: {
        show: false
      }
    });
  }

  componentWillUnmount() {
    this.flightStoreListenerToken.remove();
  }

  _storeChanged() {
    const flights = flightStore.getFlights();
    const data = [ ];
    statuses.getAll().forEach(status => {
      data.push({
        status: status.name,
        Flights: flights.filter(f => f.status === status.name).length
      });
    });

    this.chart.load({
      json: data,
      keys: {
        x: 'status',
        value: [ 'Flights' ]
      }
    });
  }

  render() {
    return (
      <div id={this.id} className={this.className}></div>
    );
  }
}

module.exports = StatusStepGraph;
