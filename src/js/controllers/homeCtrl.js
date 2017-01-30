(function() {
  'use strict';

  let app = angular.module('app');

  app.controller('HomeCtrl', ['$scope', '$state', '$firebaseAuth', '$firebaseObject', '$http', '$interval', function($scope, $state, $firebaseAuth, $firebaseObject, $http, $interval) {
    console.log('HomeCtrl');

    let auth = $firebaseAuth();
    let currentLocation;

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

              currentLocation = $scope.objMods.modules[0].location;
              console.log("currentLocation",currentLocation);

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

            let key = 'a01445a972f04947b49150500172701';
            // let currentWeatherUrl = 'http://api.apixu.com/v1/current.json?key=' + key + '&q=' + currentLocation;
            let forecastWeatherUrl = 'http://api.apixu.com/v1/forecast.json?key=' + key + '&q=' + currentLocation;

            // let fetchCurrentWeather = () => {
            //     $scope.loadingWeatherData = true;
            //   $http({
            //     method: 'GET',
            //     url: currentWeatherUrl
            //   }).then(function successCallback(response) {
            //       console.log('success fetchCurrentWeather', response.data.current);
            //       $scope.weatherLocation = response.data.location.name + ', ' + response.data.location.country;
            //       $scope.weatherData = response.data.current;
            //       $scope.loadingWeatherData = false;
            //
            //     }, function errorCallback(response) {
            //       console.log('error', response);
            //       $scope.loadingWeatherData = false;
            //     });
            // };

            let fetchForecastWeather = () => {
                $scope.loadingWeatherData = true;
              $http({
                method: 'GET',
                url: forecastWeatherUrl
              }).then(function successCallback(response) {
                  console.log('success fetchForecastWeather', response.data);
                  $scope.weatherLocation = response.data.location.name + ', ' + response.data.location.country;
                  $scope.weatherData = response.data.current;
                  $scope.loadingWeatherData = false;

                }, function errorCallback(response) {
                  console.log('error', response);
                  $scope.loadingWeatherData = false;
                });
            };

            // fetchCurrentWeather();
            fetchForecastWeather();

            $interval(function(){
              console.log('getting latest weather...');
              // fetchCurrentWeather();
              fetchForecastWeather();
            }, 1800000);

          }).catch(function(error) {
            console.log(error);
          });
        };
        getUserData();


      }
    });

  }]);
})();
