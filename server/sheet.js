'use strict';
const request = require('request');

class Sheet {
  setSheetID(sheetID) {
    this.id = sheetID;
    return Promise.resolve(this.id);
  }

  objDiff(o1, o2) {
    const diff = { };
    for(let p of Object.keys(o1)) {
      if(o1[p] !== o2[p] && p[0] !== '_') {
        diff[p] = true;
      }
    }
    for(let p of Object.keys(o2)) {
      if(o1[p] !== o2[p] && p[0] !== '_') {
        diff[p] = true;
      }
    }

    const diffProps = [ ];
    for(let p of Object.keys(diff)) {
      diffProps.push(p);
    }

    return diffProps;
  }

  getFeedURL(accessToken, feedRel) {
    if(!this[feedRel]) {
      // If we haven't gotten the feed URL yet, go get it.
      return new Promise((resolve, reject) => {
        request.get(`https://spreadsheets.google.com/feeds/worksheets/${this.id}/private/full?alt=json`, { headers: { 'Authorization': `Bearer ${accessToken}` }}, (err, res, body) => {
          if(err) {
            return reject(err);
          }

          try {
            body = JSON.parse(body);
          } catch(e) {
            return reject(new Error('Could not parse sheet body'));
          }

          if(!body.feed || !body.feed.entry || !body.feed.entry[0]) {
            return reject(new Error('Invalid sheet'));
          }

          for(let link of body.feed.entry[0].link) {
            if(link.rel === feedRel) {
              // Now save the feed URL, and resolve the promise.
              this[feedRel] = link.href;
              return resolve(link.href);
            }
          }

          reject(new Error('Could not find feed link'));
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
      this.getFeedURL(accessToken, 'http://schemas.google.com/spreadsheets/2006#listfeed')
        .then(listFeed => {
          // With that, we can then get the actual rows.
          request.get(`${listFeed}?alt=json`, { headers: { 'Authorization': `Bearer ${accessToken}` } }, (err, res, body) => {
            if(err) {
              return reject(err);
            }

            try {
              body = JSON.parse(body);
            } catch(e) {
              console.log('Body parse fail');
              return reject(e);
            }

            const rows = [ ];
            for(let r of body.feed.entry) {
              // Stash off the row and some relevant links.
              let row = {
                _id: r.id.$t,
                _rowNumber: rows.length + 2, // rows start at 1; row 1 is the header, so actual data starts on row 2
                _links: {
                    edit: ''
                }
              };

              for(let l of r.link) {
                if(l.rel === 'edit') {
                  row._links.edit = l.href;
                }
              }

              // Column names are prefixed with 'gsx$' in JSON,
              // a compromise with the gsx: namespace used in
              // the atom feed.  I'm not sure what the '$t' is
              // all about.
              for(let key of Object.keys(r)) {
                if(key.substr(0, 4) === 'gsx$') {
                  row[key.substr(4)] = r[key].$t;
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
      let targetRow = null;
      let cellsToChange = null;

      row.staff3 = row.staff4 = '';
      if(row.staff.length) {
          row.staff3 = row.shift();
          if(row.staff.length) {
              row.staff = row.shift();
          }
      }
      delete row.staff;

      // Get the rows as Google has them now.  The reason for this is
      // that the edit link may have changed, if someone else has
      // modified the row since we originally fetched it.
      this.getRows(accessToken)
        .then(rows => {
          // Now get the row we're actually interested in.
          targetRow = rows.find(r => r._id === row._id);
          if(targetRow) {
              cellsToChange = this.objDiff(row, targetRow);
              if(cellsToChange.length === 1) {
                  return this.getFeedURL(accessToken, 'http://schemas.google.com/spreadsheets/2006#cellsfeed');
              }
              return false;
          } else {
              throw new Error(`No row found with ID [${row._id}]`);
          }
        })
        .then(cellFeedURL => {
          return new Promise((cellUpdateResolve, cellUpdateReject) => {
            if(cellFeedURL) {
              request.get(`${cellFeedURL}?alt=json`, { headers: { 'Authorization': `Bearer ${accessToken}` } }, (err, res, body) => {
                if(err) {
                  console.log(err);
                  return cellUpdateReject(err);
                }

                try {
                  body = JSON.parse(body);
                } catch(e) {
                  console.log('Body parse fail');
                  return cellUpdateReject(e);
                }

                let colNumber = -1;
                for(let cell of body.feed.entry) {
                  if(Number(cell.gs$cell.row) === 1 && cell.content.$t.toLowerCase().replace(' ', '') === cellsToChange[0]) {
                    colNumber = Number(cell.gs$cell.col);
                    break;
                  }
                }

                const targetCell = body.feed.entry.find(c => (Number(c.gs$cell.row) === targetRow._rowNumber && Number(c.gs$cell.col) === colNumber));
                if(targetCell) {
                  const cellID = targetCell.id.$t;
                  const editURL = targetCell.link.find(l => l.rel === 'edit');

                  request.put(editURL.href, { headers: { 'Content-type': 'application/atom+xml', 'Authorization': `Bearer ${accessToken}` }, body: this.atomizeCell(cellID, targetRow._rowNumber, colNumber, row[cellsToChange[0]]) }, (err) => {
                    if(err) {
                      console.log('Error updating cell');
                      console.log(err);
                      return cellUpdateReject(err);
                    }
                    cellUpdateResolve();
                  });
                } else {
                  cellUpdateReject(new Error(`Could not find target cell (row ${targetRow._rowNumber}, column ${colNumber})`));
                }
              });
            } else if(cellsToChange.length > 1) {
              request.put(targetRow._links.edit, { headers: { 'Content-type': 'application/atom+xml', 'Authorization': `Bearer ${accessToken}` }, body: this.atomizeRow(row) }, (err) => {
                if(err) {
                  console.log(err);
                  return cellUpdateReject(err);
                }
                cellUpdateResolve();
              });
            }
          });
        })
        .then(resolve)
        .catch(err => {
          console.log('Error updating cell/row');
          console.log(err);
          reject(err);
        });
    });
  }

  atomizeCell(id, row, column, value) {
    return `<?xml version='1.0' encoding='UTF-8'?>
      <entry xmlns='http://www.w3.org/2005/Atom' xmlns:gs='http://schemas.google.com/spreadsheets/2006'>
        <id>${id}</id>
        <gs:cell row='${row}' col='${column}' inputValue='${value}'/>
      </entry>`;
  }

  atomizeRow(row) {
    return `<?xml version='1.0' encoding='UTF-8'?>
      <entry xmlns='http://www.w3.org/2005/Atom' xmlns:gsx='http://schemas.google.com/spreadsheets/2006/extended'>
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
