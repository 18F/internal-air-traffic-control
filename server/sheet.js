"use strict";
const request = require("request");

class Sheet {
    setSheetID(sheetID) {
        this.id = sheetID;
        return Promise.resolve(this.id);
    }

    getListFeedURL(accessToken) {
        if(!this.listFeedURL) {
            return new Promise((resolve, reject) => {
                request.get(`https://spreadsheets.google.com/feeds/worksheets/${this.id}/private/full?alt=json`, { headers: { "Authorization": `Bearer ${accessToken}` }}, (err, res, body) => {
                    if(err) {
                        return reject(err);
                    }

                    try {
                        body = JSON.parse(body);
                    } catch(e) {
                        return reject(new Error("Could not parse sheet body"));
                    }

                    if(!body.feed || !body.feed.entry || !body.feed.entry[0]) {
                        return reject(new Error("Invalid sheet"));
                    }

                    for(let link of body.feed.entry[0].link) {
                        if(link.rel.indexOf("#listfeed") >= 0) {
                            this.listFeedURL = link.href;
                            return resolve(link.href)
                        }
                    }

                    reject(new Error("Could not find list feed link"));
                });
            });
        } else {
            return Promise.resolve(this.listFeedURL);
        }
    }

    getRows(accessToken) {
        return new Promise((resolve, reject) => {
            this.getListFeedURL(accessToken)
                .then(listFeed => {
                    request.get(`${listFeed}?alt=json`, { headers: { "Authorization": `Bearer ${accessToken}` } }, (err, res, body) => {
                        if(err) {
                            return reject(e);
                        }

                        try {
                            body = JSON.parse(body);
                        } catch(e) {
                            console.log("Body parse fail");
                            return reject(e);
                        }

                        const rows = [ ];
                        for(let r of body.feed.entry) {
                            let row = { };
                            for(let key of Object.keys(r)) {
                                if(key.substr(0, 4) === "gsx$") {
                                    row[key.substr(4)] = r[key]["$t"];
                                }
                            }
                            rows.push(row);
                        }

                        resolve(rows);
                    });
                })
                .catch(e => {
                    reject(e);
                });
        });
    }
}

module.exports = new Sheet();
