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
                            let row = {
                                _id: r.id.$t,
                                _links: {
                                    edit: ""
                                }
                            };

                            for(let l of r.link) {
                                if(l.rel === "edit") {
                                    row._links.edit = l.href;
                                }
                            }

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

    updateRow(row, accessToken) {
        return new Promise((resolve, reject) => {
            this.getRows(accessToken)
                .then(rows => {
                    const targetRow = rows.find(r => r._id === row._id);
                    if(targetRow) {
                        request.put(targetRow._links.edit, { headers: { "Content-type": "application/atom+xml", "Authorization": `Bearer ${accessToken}` }, body: this.atomizeRow(row) }, (err) => {
                            if(err) {
                                console.log(err);
                                reject(new Error("Error updating row"));
                            } else {
                                resolve();
                            }
                        });
                    } else {
                        reject(new Error(`No row found with ID [${row._id}]`))
                    }

                })
        });
    }

    atomizeRow(row) {
        return `<?xml version="1.0" encoding="UTF-8"?>
            <entry xmlns="http://www.w3.org/2005/Atom" xmlns:gsx="http://schemas.google.com/spreadsheets/2006/extended">
                <id>${row._id}</id>
                <gsx:id>${row.id}</gsx:id>
                <gsx:description>${row.description}</gsx:description>
                <gsx:status>${row.status}</gsx:status>
                <gsx:lead>${row.lead}</gsx:lead>
                <gsx:pair>${row.pair}</gsx:pair>
            </entry>`;
    }
}

module.exports = new Sheet();
