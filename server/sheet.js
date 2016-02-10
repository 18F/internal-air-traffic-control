"use strict";
const request = require("request");

class Sheet {
    setSheetID(sheetID) {
        this.id = sheetID;
        return Promise.resolve(this.id);
    }

    load(accessToken) {
        return new Promise((resolve, reject) => {
            request.get(`https://spreadsheets.google.com/feeds/worksheets/${this.id}/private/full?alt=json`, { headers: { "Authorization": `Bearer ${accessToken}` } }, (err, res, body) => {
                if(err) {
                    return reject(err);
                }

                try {
                    body = JSON.parse(body);
                } catch(e) {
                    return reject(new Error("Could not parse sheet body"));
                }

                if(!body.feed || !body.feed.entry) {
                    return reject(new Error("Invalid sheet"));
                }

                for(let link of body.feed.entry[0].link) {
                    if(link.rel.indexOf("#listfeed") >= 0) {
                        return resolve(this.id)
                    }
                }

                reject(new Error("Could not find list feed link"));
            });
        });
    }

    getRows(accessToken) {
        return new Promise((resolve, reject) => {
            console.log("Getting rows...");
            request.get(`https://spreadsheets.google.com/feeds/worksheets/${this.id}/private/full?alt=json`, { headers: { "Authorization": `Bearer ${accessToken}` } }, (err, res, body) => {
                try {
                    body = JSON.parse(body);
                } catch(e) {
                    console.log("Body 1 parse fail");
                    return reject(e);
                }

                for(let link of body.feed.entry[0].link) {
                    if(link.rel.indexOf("#listfeed") >= 0) {
                        request.get(`${link.href}?alt=json`, { headers: { "Authorization": `Bearer ${accessToken}` } }, (err, res, body) => {
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
                        break;
                    }
                }
            });
        });
    }
}

module.exports = new Sheet();
