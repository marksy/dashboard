(function() {
  'use strict';

  let app = angular.module('app');

  app.config(function($stateProvider, $urlRouterProvider, $locationProvider) {

    $urlRouterProvider.otherwise('/');
    // $locationProvider.html5Mode(true);

    let states = [
      {
        name: 'home',
        url: '/',
        component: 'home',
        templateUrl: 'partials/home.html',
        controller: 'HomeCtrl'
      },
      {
        name: 'login',
        url: '/login',
        component: 'login',
        templateUrl: 'partials/login.html',
        controller: 'loginCtrl'
      },
      {
        name: 'signup',
        url: '/signup',
        component: 'signup',
        templateUrl: 'partials/signup.html',
        controller: 'signupCtrl'
      },
      {
        name: 'prefs',
        url: '/prefs',
        component: 'prefs',
        templateUrl: 'partials/prefs.html',
        controller: 'prefsCtrl'
      }
    ];

    // Loop over the state definitions and register them
    states.forEach(function(state) {
      $stateProvider.state(state);
    });

  });

})();
