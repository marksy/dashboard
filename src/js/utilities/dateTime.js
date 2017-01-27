(function() {
  'use strict';

  let app = angular.module('app');

  app.directive('dateTime', function(dateFilter) {
    return function(scope, element, attrs) {

      let format;

      scope.$watch(attrs.dateTime, function(value) {
        format = value;
        updateTime();
      });

      let updateTime = () => {
        var dt = dateFilter(new Date(), format);
        element.text(dt);
      };

      let updateLater = () => {
        setTimeout(function() {
          updateTime();
          updateLater();
        }, 60000);
      };

      updateLater();
    };
  });

})();
