(function() {
  'use strict';

  let app = angular.module('app');

  app.config(function($stateProvider, $urlRouterProvider, $locationProvider, $compileProvider) {

    $urlRouterProvider.otherwise('/');
    $compileProvider.debugInfoEnabled(false);
    $locationProvider.html5Mode(false);

    let states = [
      {
        name: 'home',
        url: '/',
        component: 'home',
        templateUrl: 'partials/home.html',
        controller: 'HomeController'
      },
      {
        name: 'login',
        url: '/login',
        component: 'login',
        templateUrl: 'partials/login.html',
        controller: 'LoginController'
      },
      {
        name: 'signup',
        url: '/signup',
        component: 'signup',
        templateUrl: 'partials/signup.html',
        controller: 'SignupController'
      },
      {
        name: 'prefs',
        url: '/prefs',
        component: 'prefs',
        templateUrl: 'partials/prefs.html',
        controller: 'PrefsController'
      }
    ];

    // Loop over the state definitions and register them
    states.forEach(function(state) {
      $stateProvider.state(state);
    });

  });

})();
