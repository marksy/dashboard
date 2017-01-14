(function() {
  'use strict';

  let app = angular.module('app');

  app.controller('MyCtrl', function($firebaseObject) {
    let rootRef = firebase.database().ref().child('angular');
    let ref = rootRef.child('object');
    this.object = $firebaseObject(ref);
  });

})();
