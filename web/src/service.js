const request = require("browser-request");
const dispatcher = require("./dispatcher");

module.exports = {
	getUser() {
		request.get("/api/user", (err, res) => {
			if(!err && res.body) {
				try {
					dispatcher.dispatch({
						type: "user-in",
						payload: JSON.parse(res.body)
					});
				} catch(e) { }
			}
		});
	},
	
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
	},

	saveFlight(flight) {
		request.put({ url: "/api/flights", body: flight, json: true }, (err, res) => {
			console.log(err);
			if(!err) {
				this.getFlights();
			}
		});
	}
};
