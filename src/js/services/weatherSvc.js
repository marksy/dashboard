(function() {
  'use strict';

  let app = angular.module('app');

  app.factory('weather', ['$scope', function($scope) {

    let key = 'a01445a972f04947b49150500172701';
    let weatherUrl = 'http://api.apixu.com/v1/current.json?key=' + key + '&q=London';

    let data;


    $http({
      method: 'GET',
      url: weatherUrl
    }).then(function successCallback(response) {
        console.log('success', response);
        data = response;
      }, function errorCallback(response) {
        console.log('error', response);
      });

      return 'weather ';

  }]);
})();
