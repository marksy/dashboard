(function() {
  'use strict';

  const app = angular.module('app');

  app.controller('PrefsController', ['$scope', '$state', '$firebaseAuth', '$firebaseObject', '$timeout', ($scope, $state, $firebaseAuth, $firebaseObject, $timeout) => {

    let vm = $scope;

    const rando = (arr) => {
      return arr[Math.floor(Math.random() * arr.length)];
    };

    const auth = $firebaseAuth();
    const greetings = [
      'hello there',
      'Oi OI',
      'kia ora',
      'zdrasti',
      'a-hoy there',
      'gidday',
      'alright',
      'bonjour',
      'hiiii',
      'hej',
      'sup',
      'wagwan'
    ];
    vm.greeting = rando(greetings);
    console.log(vm.greeting + ' majte');

    vm.showAlert = false;

    vm.alert = {
      prefsUpdated: "Preferences updated.",
      prefsFailed: "Failed updating preferences.",
      networkLost: "Network has lost connection.",
      networkRestored: "Network has restored."
    };

    vm.stations = [
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
      vm.authData = authData;

      if(authData === null) {
        $state.go('login');
      } else {
        let userId = authData.providerData[0].uid;
        vm.displayName = authData.providerData[0].displayName;
        vm.photoURL = authData.providerData[0].photoURL;

        const getUserData = function() {
          let currentUser = firebase.database().ref().child('/users/' + userId);
          let userExists = $firebaseObject(firebase.database().ref().child('/users/' + userId));

          return currentUser.once('value').then(function(s) {
            if(s.val() !== null) {
              vm.objMods = s.val();
            } else {
              //create a blank model
              vm.objMods = {
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
            vm.$apply();
          }).catch(function(error) {
            console.log(error);
          });
        };
        getUserData();

        let onComplete = function(error) {
          if (error) {
            console.log('Synchronization failed');
            vm.showAlert = true;
            vm.alert.message = vm.alert.prefsFailed;
          } else {
            console.log('Synchronization succeeded');
            vm.showAlert = true;
            vm.alert.message = vm.alert.prefsUpdated;
            vm.$apply();
            $timeout(function() {
              console.log('setimeout');
              vm.showAlert = false;
            }, 5000);
          }
        };

        vm.updateModel = function() {
          const model = vm.objMods;
          firebase.database().ref('users/' + userId).set(model, onComplete);
        };
      }
    });


    vm.signout = function() {
      auth.$signOut();
    };

  }]);
})();
