(function() {
  'use strict';

  let app = angular.module('app');

  app.directive('cleanStation', function () {
    return {
      restrict: 'E',
      scope: {
        label: '='
      },
      template: '<span>{{text}}</span>',
      controller: function ($scope) {
        $scope.text = $scope.label.replace(/( Rail Station)/g, '');
      }
    };
  });

})();
