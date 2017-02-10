(function() {
  'use strict';

  let app = angular.module('app');

  app.directive('twitterLinks', function () {
    return {
      restrict: 'E',
      scope: {
        label: '='
      },
      template: '{{text}}',
      controller: function ($scope, $sce) {
        $scope.text = $scope.label.replace(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g, '');
      }
    };
  });

})();
