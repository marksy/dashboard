(function() {
  'use strict';

  let app = angular.module('app');

  app.directive('onFinishRender', function ($timeout) {
    return {
      restrict: 'A',
      link: function (scope, element, attr) {
        if (scope.$last === true) {
          $timeout(function () {
            scope.$emit(attr.onFinishRender);
            console.log('finished render of list');
          });
        }
      }
    };
  });

})();
