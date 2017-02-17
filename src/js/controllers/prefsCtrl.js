(function() {
  'use strict';

  const app = angular.module('app');

  app.controller('PrefsController', ['$scope', '$state', '$firebaseAuth', '$firebaseObject', '$timeout', '$sanitize', ($scope, $state, $firebaseAuth, $firebaseObject, $timeout, $sanitize) => {

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
      networkRestored: "Network has restored.",
      creationSuccess: "New user created successfully.",
      creationFailed: "New user created successfully."
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
                    active: true,
                    location: "London, United Kingdom",
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
              firebase.database().ref('users/' + userId).set(vm.objMods, onCreate);
            }
            vm.$apply();
          }).catch(function(error) {
            console.log(error);
          });
        };
        getUserData();

        let onCreate = function(error) {
          if (error) {
            console.log('Creation failed', error);
            vm.showAlert = true;
            vm.alert.message = vm.alert.creationFailed;
          } else {
            console.log('Creation succeeded');
            vm.showAlert = true;
            vm.alert.message = vm.alert.creationSuccess;
            vm.$apply();
            $timeout(function() {
              vm.showAlert = false;
            }, 3000);
          }
        };

        let onComplete = function(error) {
          if (error) {
            console.log('Synchronization failed', error);
            vm.showAlert = true;
            vm.alert.message = vm.alert.prefsFailed;
          } else {
            console.log('Synchronization succeeded');
            vm.showAlert = true;
            vm.alert.message = vm.alert.prefsUpdated;
            vm.$apply();
            $timeout(function() {
              vm.showAlert = false;
            }, 3000);
          }
        };

        vm.updateModel = function() {
          $sanitize(vm.objMods.modules[0].location);
          $sanitize(vm.objMods.modules[2].baseCurrency);
          $sanitize(vm.objMods.modules[2].currencyOne);
          $sanitize(vm.objMods.modules[2].currencyTwo);
          $sanitize(vm.objMods.modules[3].user);

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
