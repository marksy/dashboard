(function() {
  'use strict';

  const app = angular.module('app');

  app.controller('prefsCtrl', ['$scope', '$state', '$firebaseAuth', '$firebaseObject', ($scope, $state, $firebaseAuth, $firebaseObject) => {
    console.log('prefsCtrl object: ');

    // let rootRef = firebase.database().ref().child('users');
    // let ref = rootRef.child('116196474336917056939');
    // let obj = $firebaseObject(ref);

    const rando = (arr) => {
      return arr[Math.floor(Math.random() * arr.length)];
    };

    const auth = $firebaseAuth();
    const greetings = [
      'hello there',
      'Oi OI',
      'alright',
      'bonjour',
      'hiiii',
      'hej',
      'sup',
      'wagwan'
    ];
    $scope.greeting = rando(greetings);

    $scope.stations = [
      {
        name: "Forest Hill",
        code: "910GFORESTH",
      },
      {
        name: "Honor Oak",
        code: "910GHONROPK",
      },
      {
        name: "Catford",
        code: "910GCATFORD",
      },
      {
        name: "Catford Bridge",
        code: "910GCATFBDG",
      }
    ];

    auth.$onAuthStateChanged(function(authData) {
      $scope.authData = authData;

      if(authData === null) {
        $state.go('login');
      } else {
        console.log('logged in as ', authData.providerData[0].uid);
        let userId = authData.providerData[0].uid;
        $scope.displayName = authData.providerData[0].displayName;
        $scope.photoURL = authData.providerData[0].photoURL;

        const getUserData = function() {
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
                    active: false,
                    location: "London, uk",
                    unit: "c"
                  },
                  {
                    name: "tfl",
                    active: false,
                    tubeFaults: true,
                    lines: "910GFORESTH"
                  },
                  {
                    name: "finance",
                    active: false,
                    baseCurrency: "GBP",
                    currencyOne: "NZD",
                    currencyTwo: "USD"
                  },
                  {
                    name: "twitter",
                    active: false,
                    user: "BBCBreaking"
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

        $scope.updateModel = function() {
          const model = $scope.objMods;
          firebase.database().ref('users/' + userId).set(model);
          console.log('model', $scope.objMods);
        };
      }
    });


    $scope.signout = function() {
      console.log('clicked signout');
      auth.$signOut();
    };

  }]);
})();
