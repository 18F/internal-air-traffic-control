This project is still **VERY** alpha-quality.

To get started, clone this repo, then run `npm install` to get all the dependencies and dev dependencies installed.  Since the built web components are shipped in the repo, it is not necessary to build them initially, though you will need to do so as you change things.

To get it started, run `npm start` - this will get things going at [http://localhost:5000](http://localhost:5000).  Everything is served up by `restify`.

If you make any changes to the _web_ HTML, Javascript, or SASS, you will need to rebuild the web components.  To do this, just run `npm run build`.  If you've only changed HTML or Javascript, you can run just `npm run build-html`, and if you've only changed SASS, you can run `npm run build-style`.  The `npm run build` script just does both.

If you make any changes to the _server_ code, you will need to stop and restart.  `CTRL+C` will stop the server, and then just restart as above.  Note that at this time. the `data.json` is only read at startup, so changing the data will (for now) require restarting the server.

### Public domain

This project is in the worldwide [public domain](LICENSE.md). As stated in [CONTRIBUTING](CONTRIBUTING.md):

> This project is in the public domain within the United States, and copyright and related rights in the work worldwide are waived through the [CC0 1.0 Universal public domain dedication](https://creativecommons.org/publicdomain/zero/1.0/).
>
> All contributions to this project will be released under the CC0 dedication. By submitting a pull request, you are agreeing to comply with this waiver of copyright interest.
