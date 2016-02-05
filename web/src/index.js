const React = require("react");
const ReactDOM = require("react-dom");
const FlightList = require("./components/flightList");

require("./service").getFlights();

ReactDOM.render(
	<FlightList/>,
	document.getElementById("content")
);
