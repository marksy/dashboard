(function() {
  'use strict';

  let app = angular.module('app');

  app.directive('twitterDate', function () {
    return {
      restrict: 'E',
      scope: {
        label: '='
      },
      template: '<span class="date-time">{{text | date: "EEE d MMM yyyy, h:mm a"}}</span>',
      controller: function ($scope) {
        $scope.text = new Date(Date.parse($scope.label));
      }
    };
  });

})();
