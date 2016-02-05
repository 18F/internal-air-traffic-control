const request = require("browser-request");
const dispatcher = require("./dispatcher");

module.exports = {
	getFlights() {
		request.get("/api/flights", (err, res) => {
			if(!err && res.body) {
				try {
					dispatcher.dispatch({
						type: "flights-in",
						payload: JSON.parse(res.body)
					});
				} catch(e) { }
			}
		});
	}
};
