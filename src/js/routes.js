(function() {
  'use strict';

  let app = angular.module('app');

  app.config(function($stateProvider, $urlRouterProvider, $locationProvider, $compileProvider) {

    $urlRouterProvider.otherwise('/');
    $compileProvider.debugInfoEnabled(true);
    $locationProvider.html5Mode(false);

    let states = [
      {
        name: 'home',
        url: '/',
        component: 'home',
        templateUrl: 'partials/home.html',
        controller: 'HomeController',
        controllerAs: 'homeCtrl'
      },
      {
        name: 'login',
        url: '/login',
        component: 'login',
        templateUrl: 'partials/login.html',
        controller: 'LoginController',
        controllerAs: 'loginCtrl'
      },
      {
        name: 'signup',
        url: '/signup',
        component: 'signup',
        templateUrl: 'partials/signup.html',
        controller: 'SignupController',
        controllerAs: 'signupCtrl'
      },
      {
        name: 'prefs',
        url: '/prefs',
        component: 'prefs',
        templateUrl: 'partials/prefs.html',
        controller: 'PrefsController',
        controllerAs: 'prefsCtrl'
      }
    ];

    // Loop over the state definitions and register them
    states.forEach(function(state) {
      $stateProvider.state(state);
    });

  });

})();
