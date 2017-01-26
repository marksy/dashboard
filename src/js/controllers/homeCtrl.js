(function() {
  'use strict';

  let app = angular.module('app');

  app.controller('HomeCtrl', ['$scope', '$state', '$firebaseAuth', '$firebaseObject', function($scope, $state, $firebaseAuth, $firebaseObject) {
    console.log('HomeCtrl');

    let auth = $firebaseAuth();

    auth.$onAuthStateChanged(function(authData) {
      $scope.authData = authData;

      if(authData === null) {
        $state.go('login');
      } else {
        console.log('is logged in:' , authData);
        let userId = authData.providerData[0].uid;
        $scope.displayName = authData.providerData[0].displayName;
        $scope.photoURL = authData.providerData[0].photoURL;

        let getUserData = function() {
          let currentUser = firebase.database().ref().child('/users/' + userId);
          let userExists = $firebaseObject(firebase.database().ref().child('/users/' + userId));
          console.log('userExists', userExists);

          return currentUser.once('value').then(function(s) {
            console.log('s',s.val());
            if(s.val() !== null) {
              $scope.objMods = s.val();
            } else {
              //create a blank model
              $scope.objMods = {
                modules: [
                  {
                    name: "weather",
                    active: true,
                    location: "London, uk",
                    unit: "c"
                  },
                  {
                    name: "tfl",
                    active: false,
                    tubeFaults: true,
                    lines: [
                      {
                        origin: "Catford Bridge",
                        destination: "London Charing Cross",
                      }
                    ]
                  },
                  {
                    name: "finance",
                    active: false,
                    localCurrency: "GBP",
                    foreignCurrency: "NZD"
                  },
                  {
                    name: "twitter",
                    active: false,
                    user: "BBCBreakingNews"
                  },
                  {
                    name: "strava",
                    active: false,
                    key: "54b0e167486e9e58b52d9b1a73b5471e24c5cf58"
                  }
                ]
              };
            }
            $scope.$apply();
            console.log('objMods', $scope.objMods);
          }).catch(function(error) {
            console.log(error);
          });
        };
        getUserData();


      }
    });


  }]);
})();
