(function() {
  'use strict';

  const config = {
    apiKey: "AIzaSyC_exNmuiarHa5hLjmAocQrh32fB-0vJE0",
    authDomain: "obsidian-5b285.firebaseapp.com",
    databaseURL: "https://obsidian-5b285.firebaseio.com"
  };
  firebase.initializeApp(config);

  const app = angular.module('app', ['ui.router', 'firebase']);

  const dateTime = require('./utilities/dateTime.js');
  const cleanStation = require('./utilities/cleanStationName.js');
  const cleanLine = require('./utilities/cleanLineName.js');
  const twitterLinks = require('./utilities/twitterLinks.js');
  const twitterDate = require('./utilities/twitterDate.js');

  // const Codebird = require('./utilities/codebird.js');

  // const weatherSvc = require('./services/weatherSvc.js');

  const MyCtrl = require('./controllers/myCtrl.js');
  const HomeCtrl = require('./controllers/homeCtrl.js');
  const LoginCtrl = require('./controllers/loginCtrl.js');
  const PrefsCtrl = require('./controllers/prefsCtrl.js');
  const SignupCtrl = require('./controllers/signupCtrl.js');

  const routes = require('./routes.js');

  const beerOclock = require('./utilities/beeroclock.js');


})();
