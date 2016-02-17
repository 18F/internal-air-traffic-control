"use strict";
const request = require("request");

class Sheet {
    setSheetID(sheetID) {
        this.id = sheetID;
        return Promise.resolve(this.id);
    }

    getFeedURL(accessToken, feedRel) {
        if(!this[feedRel]) {
            // If we haven't gotten the feed URL yet, go get it.
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
                        if(link.rel == feedRel) {
                            // Now save the feed URL, and resolve the promise.
                            this[feedRel] = link.href;
                            return resolve(link.href)
                        }
                    }

                    reject(new Error("Could not find feed link"));
                });
            });
        } else {
            // If we already have it, resolve it immediately.
            return Promise.resolve(this[feedRel]);
        }
    }

    getRows(accessToken) {
        return new Promise((resolve, reject) => {
            // The sheet feed URL comes from Google, so calling this
            // before we try to get the feed guarantees that we've
            // got the feed URL.
            this.getFeedURL(accessToken, "http://schemas.google.com/spreadsheets/2006#listfeed")
                .then(listFeed => {
                    // With that, we can then get the actual rows.
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

                            // Stash off the row and some relevant links.
                            let row = {
                                _id: r.id.$t,
                                _rowNumber: rows.length + 2, // rows start at 1; row 1 is the header, so actual data starts on row 2
                                _links: {
                                    edit: ""
                                }
                            };

                            for(let l of r.link) {
                                if(l.rel === "edit") {
                                    row._links.edit = l.href;
                                }
                            }

                            // Column names are prefixed with "gsx$" in JSON,
                            // a compromise with the gsx: namespace used in
                            // the atom feed.  I'm not sure what the "$t" is
                            // all about.
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
            // Get the rows as Google has them now.  The reason for this is
            // that the edit link may have changed, if someone else has
            // modified the row since we originally fetched it.
            this.getRows(accessToken)
                .then(rows => {
                    // Now get the row we're actually interested in.
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
