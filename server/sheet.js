"use strict";
const request = require("request");

class Sheet {
    setSheetID(sheetID) {
        this.id = sheetID;
        return Promise.resolve(this.id);
    }

    setAccessToken(accessToken) {
        this.accessToken = accessToken;
        return Promise.resolve(this.accessToken);
    }

    load() {
        return new Promise((resolve, reject) => {
            request.get(`https://spreadsheets.google.com/feeds/spreadsheets/private/full/${this.id}?alt=json`, { headers: { "Authorization": `Bearer ${this.accessToken}` } }, (err, res, body) => {
                if(err) {
                    return reject(err);
                }

                try {
                    body = JSON.parse(body);
                } catch(e) {
                    return reject(new Error("Could not parse sheet body"));
                }

                if(!body.entry) {
                    return reject(new Error("Sheet body does not have an entry"));
                }

                resolve(this.id);
            });
        });
    }
}

module.exports = new Sheet();
