'use strict';

require('dotenv').config();
const cfenv = require('cfenv');
const appEnv = cfenv.getAppEnv();

const knownEnvs = [
  'TRELLO_API_KEY',
  'TRELLO_CLIENT_SECRET',
  'ATC_TRELLO_BOARD_ID',
  'HOST',
  'LOG_LEVEL'
];

if (appEnv.getServices() && Object.keys(appEnv.getServices()).length) {
  // If running on Cloud Foundry
  for (const env of knownEnvs) {
    process.env[env] = appEnv.getServiceCreds('atc-trello-cups')[env];
  }
  process.env.HOST = appEnv.url;
}
