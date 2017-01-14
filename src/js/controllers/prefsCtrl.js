(function() {
  'use strict';

  let app = angular.module('app');

  app.controller('prefsCtrl', ['$scope', '$state', '$firebaseAuth', '$firebaseObject', function($scope, $state, $firebaseAuth, $firebaseObject) {
    console.log('prefsCtrl object: ');

    // let rootRef = firebase.database().ref().child('users');
    // let ref = rootRef.child('116196474336917056939');
    // let obj = $firebaseObject(ref);

    let auth = $firebaseAuth();

    auth.$onAuthStateChanged(function(authData) {
      $scope.authData = authData;

      if(authData === null) {
        $state.go('login');
      } else {
        console.log('logged in as ', authData.providerData[0].uid);
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
                    data: [
                      {
                        location: "London, uk",
                        standardUnit: true
                      }
                    ]
                  },
                  {
                    name: "tfl",
                    active: false,
                    data: [
                      {
                        tubeFaults: true,
                        lines: [
                          'Victoria',
                          'london-overgound'
                        ]
                      }
                    ]
                  },
                  {
                    name: "finance",
                    active: false,
                    data: [
                      {
                        localCurrency: "GBP",
                        foreignCurrency: "NZD"
                      }
                    ]
                  },
                  {
                    name: "twitter",
                    active: false,
                    data: [
                      {
                        user: "BBCBreakingNews"
                      }
                    ]
                  },
                  {
                    name: "strava",
                    active: false,
                    data: [
                      {
                        key: "54b0e167486e9e58b52d9b1a73b5471e24c5cf58"
                      }
                    ]
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

        $scope.updateModel = () => {
          let model = $scope.objMods;
          firebase.database().ref('users/' + userId).set(model);
          console.log('model', $scope.objMods);
        };
      }
    });


    $scope.signout = () => {
      console.log('clicked signout');
      auth.$signOut();
    };

  }]);
})();
