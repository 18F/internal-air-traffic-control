const React = require("react");
const ReactDOM = require("react-dom");
const Auth = require("./components/auth");
const FlightList = require("./components/flight-list");

require("./service").getFlights();
require("./service").getUser();

ReactDOM.render(
	<Auth/>,
	document.getElementById("auth")
);

ReactDOM.render(
	<FlightList/>,
	document.getElementById("content")
);
