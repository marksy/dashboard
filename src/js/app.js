import secret from './config';

(function() {
  'use strict';

  const angular = require('angular');
  const angularSanitize = require('angular-sanitize');
  const angularAnimate = require('angular-animate');
  const angularUIRouter = require('angular-ui-router');
  const firebase = require('firebase');
  const angularfire = require('angularfire');


  const config = {
    apiKey: secret.apiKey,
    authDomain: secret.authDomain,
    databaseURL: secret.databaseURL
  };

  firebase.initializeApp(config);

  const app = angular.module('app', ['ui.router', 'firebase', 'ngSanitize', 'ngAnimate']);

  const dateTime = require('./utilities/dateTime.js');
  const cleanStation = require('./utilities/cleanStationName.js');
  const cleanLine = require('./utilities/cleanLineName.js');
  const twitterLinks = require('./utilities/twitterLinks.js');
  const twitterDate = require('./utilities/twitterDate.js');
  const onFinishRender = require('./utilities/onFinishRender.js');

  const MyCtrl = require('./controllers/myCtrl.js');
  const HomeCtrl = require('./controllers/homeCtrl.js');
  const LoginCtrl = require('./controllers/loginCtrl.js');
  const PrefsCtrl = require('./controllers/prefsCtrl.js');
  const SignupCtrl = require('./controllers/signupCtrl.js');

  const routes = require('./routes.js');

  const beerOclock = require('./utilities/beeroclock.js');
  const brexit = require('./utilities/brexit.js');


})();
