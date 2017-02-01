(function() {
  'use strict';

  let app = angular.module('app');

  app.controller('HomeCtrl', ['$scope', '$state', '$firebaseAuth', '$firebaseObject', '$http', '$interval', function($scope, $state, $firebaseAuth, $firebaseObject, $http, $interval) {
    console.log('HomeCtrl');

    const auth = $firebaseAuth();
    let currentLocation;
    let trainLine;

    // function updateIndicator() {
    //   if(navigator.onLine) {
    //   	$scope.systemOnline = true;
    //     console.log('online');
    //   } else {
    //     $scope.systemOnline = false;
    //     console.log('offline');
    //   }
    //   // $scope.$apply();
    // }
    // window.addEventListener('online',  updateIndicator);
    // window.addEventListener('offline', updateIndicator);
    // updateIndicator();

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

              trainLine = $scope.objMods.modules[1].lines;
              console.log("trainLine",trainLine);


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
                    lines: "910GFORESTH"
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

            const key = 'a01445a972f04947b49150500172701';
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

            const fetchForecastWeather = function() {
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

            const tflAppId = '81fc2bab';
            const tflAppKey = '2a45b9bd5d4a3699ccc79338d8bec6e7';
            let tflMode = 'StopPoint'; //Line
            let tflStopPoint = trainLine;// 910GCATFORD / 910GCATFBDG / 910GFORESTH
            let tflUrl = 'https://api.tfl.gov.uk/' + tflMode + '/' + tflStopPoint  + '/arrivals' + '?app_id=' + tflAppId + '&app_key=' + tflAppKey;
            let tube = 'https://api.tfl.gov.uk/line/mode/tube/status' + '?app_id=' + tflAppId + '&app_key=' + tflAppKey;

            const getTFLStatus = function() {
              // get trains
              $http({
                method: 'GET',
                url: tflUrl
              }).then(function successCallback(data) {
                  console.log('success TFL', data);
                  $scope.trainsArriving = data.data;
                  $scope.stationName = data.data[0].stationName;
                  console.log('$scope.stationName',$scope.stationName);
                }, function errorCallback(error) {
                  console.log('error', error);
                });
              //get tube
              $http({
                method: 'GET',
                url: tube
              }).then(function successCallback(data) {
                console.log('success tube', data);
                $scope.tube = data.data;
              }, function errorCallback(error) {
                console.log('error', error);
              });
            };
            getTFLStatus();

            $interval(function(){
              console.log('getting latest trains...');
              // fetchCurrentWeather();
              getTFLStatus();
            }, 60000);


          }).catch(function(error) {
            console.log(error);
          });
        };
        getUserData();


      }
    });

  }]);
})();
