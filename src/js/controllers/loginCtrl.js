(function() {
  'use strict';

  const app = angular.module('app');

  app.controller('loginCtrl', ['$scope', '$state', '$firebaseAuth', ($scope, $state, $firebaseAuth) => {
    console.log('login');
    const auth = $firebaseAuth();

    console.log(auth);

    auth.$onAuthStateChanged(function(authData) {
      $scope.authData = authData;

      if(authData !== null) {
        $scope.displayName = authData.providerData[0].displayName;
        $scope.photoURL = authData.providerData[0].photoURL;
        console.log('authdata: ', authData.providerData[0]);
        $state.go('prefs');
      }
    });

    $scope.signin = function() {
      console.log('clicked sign in ');
      auth.$signInWithPopup("google").catch(function(error) {
        console.log("Authentication failed:", error);
        console.log('trying again in 2 sec');
        setTimeout(function() {
          auth.$signInWithPopup("google");
        }, 2000);
      });
    };
    // 
    // $scope.signout = function() {
    //   console.log('clicked signout');
    //   auth.$signOut();
    // };

  }]);
})();
