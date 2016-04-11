This project is still **VERY** alpha-quality.

# Running

To get started, clone this repo, then run `npm install` to get all the dependencies and dev dependencies installed.  Since the built web components are shipped in the repo, it is not necessary to build them initially, though you will need to do so as you change things.

To get it started, run `npm start` - this will get things going at <http://localhost:5000>.  Everything is served up by [restify](https://www.npmjs.com/package/restify).

# Building

If you make any changes to the _web_ HTML, Javascript, or SASS, you will need to rebuild the web components.  To do this, just run `npm run build`.  If you've only changed HTML or Javascript, you can run just `npm run build-html`, and if you've only changed SASS, you can run `npm run build-style`.  The `npm run build` script just does both.

If you make any changes to the _server_ code, you will need to stop and restart.  `CTRL+C` will stop the server, and then just restart as above.  Note that at this time. the `data.json` is only read at startup, so changing the data will (for now) require restarting the server.

# Authentication & Environment

The server uses Trello for authentication and as a backing data store.  Users must have Trello accounts and must be able to access the board containing Air Traffic Control data.  You will need an [API key and OAuth secret from Trello](https://trello.com/app-key) (the API key is up top and the secret is near the bottom).  These should be in environment variables named `TRELLO_API_KEY` and `TRELLO_CLIENT_SECRET`, respectively.  You will also need to set the `HOST` environment variable.  This should be a full HTTP hostname as it is used to construct the Trello callback URL ({HOST}/auth/trello/callback).

Finally, you will need to identify the Trello board to be used for Air Traffic Control.  This is set in the `ATC_TRELLO_BOARD_ID` environment variable.

Authentication is persisted in user sessions.  To secure the session, a strong session secret is recommended.  This is read from the environment variable `SESSION_SECRET`.  If it is not provided in the environment variable, it uses a default, hard-coded string that is more secure than nothing, but only just barely since the code is open.  Please set the `SESSION_SECRET`.

Note that this project uses [dotenv](https://www.npmjs.com/package/dotenv), so you can store your environment variables in a `.env` file rather than defining them directly in your environment.

# Public domain

This project is in the worldwide [public domain](LICENSE.md). As stated in [CONTRIBUTING](CONTRIBUTING.md):

> This project is in the public domain within the United States, and copyright and related rights in the work worldwide are waived through the [CC0 1.0 Universal public domain dedication](https://creativecommons.org/publicdomain/zero/1.0/).

> All contributions to this project will be released under the CC0 dedication. By submitting a pull request, you are agreeing to comply with this waiver of copyright interest.
