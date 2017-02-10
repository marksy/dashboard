(function() {
  'use strict';

  let app = angular.module('app');

  app.controller('HomeController', ['$scope', '$state', '$firebaseAuth', '$firebaseObject', '$http', '$interval', '$sce', function($scope, $state, $firebaseAuth, $firebaseObject, $http, $interval, $sce) {

    const auth = $firebaseAuth();
    let currentLocation;
    let trainLine;

    auth.$onAuthStateChanged(function(authData) {
      $scope.authData = authData;

      if(authData === null) {
        $state.go('login');
      } else {
        let userId = authData.providerData[0].uid;
        $scope.displayName = authData.providerData[0].displayName;
        $scope.photoURL = authData.providerData[0].photoURL;

        let getUserData = function() {
          let currentUser = firebase.database().ref().child('/users/' + userId);
          let userExists = $firebaseObject(firebase.database().ref().child('/users/' + userId));

          return currentUser.once('value').then(function(data) {
            if(data.val() !== null) {
              $scope.objMods = data.val();

              currentLocation = $scope.objMods.modules[0].location;
              trainLine = $scope.objMods.modules[1].lines;

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

            const key = 'a01445a972f04947b49150500172701';
            if(currentLocation === undefined) {
              currentLocation = 'London';
            }
            let forecastWeatherUrl = 'http://api.apixu.com/v1/forecast.json?key=' + key + '&q=' + currentLocation;

            const fetchForecastWeather = function() {
              $scope.loadingWeatherData = true;
              $http({
                method: 'GET',
                url: forecastWeatherUrl
              }).then(function(response) {
                  $scope.weatherLocation = response.data.location.name + ', ' + response.data.location.country;
                  $scope.weatherData = response.data.current;
                  $scope.loadingWeatherData = false;

                }, function(response) {
                  console.log('error', response);
                  $scope.loadingWeatherData = false;
                });
            };

            let repeatWeather;

            if($scope.objMods.modules[0].active) {
              // fetchCurrentWeather();
              fetchForecastWeather();

              repeatWeather = $interval(function(){
                // fetchCurrentWeather();
                fetchForecastWeather();
              }, 900000); //15 mins
            }




            const tflAppId = '81fc2bab';
            const tflAppKey = '2a45b9bd5d4a3699ccc79338d8bec6e7';
            let tflMode = 'StopPoint'; //Line
            let tflStopPoint = trainLine;// 910GCATFORD / 910GCATFBDG / 910GFORESTH
            if(tflStopPoint === undefined) {
              tflStopPoint = '910GFORESTH';
            }
            let tflUrl = 'https://api.tfl.gov.uk/' + tflMode + '/' + tflStopPoint + '/arrivals' + '?app_id=' + tflAppId + '&app_key=' + tflAppKey;
            let tube = 'https://api.tfl.gov.uk/line/mode/tube/status' + '?app_id=' + tflAppId + '&app_key=' + tflAppKey;

            const getTFLStatus = function() {
              // get trains
              $http({
                method: 'GET',
                url: tflUrl
              }).then(function successCallback(data) {
                  $scope.trainsArriving = data.data;
                  $scope.stationName = data.data[0].stationName;
                }, function errorCallback(error) {
                  console.log('error', error);
                });
              //get tube
              $http({
                method: 'GET',
                url: tube
              }).then(function successCallback(data) {
                $scope.tube = data.data;
              }, function errorCallback(error) {
                console.log('error', error);
              });
            };

            let repeatTFL;

            if($scope.objMods.modules[1].active) {
              getTFLStatus();

              repeatTFL = $interval(function(){
                // fetchCurrentWeather();
                getTFLStatus();
              }, 60000); // every minute
            }





            let stravaAT = '54b0e167486e9e58b52d9b1a73b5471e24c5cf58';
            let stravaUrl = 'https://www.strava.com/api/v3/athlete/activities?access_token=' + stravaAT;
            $sce.trustAsResourceUrl(stravaUrl);

            const getStrava = function() {
              $http({
                method: 'GET',
                url: stravaUrl
              }).then(function(response) {
                  $scope.stravaData = response.data;
                }, function(response) {
                  console.log('stravaUrl fail',response);
              });
            };

            let repeatStrava;

            if($scope.objMods.modules[4].active) {
              getStrava();

              repeatStrava = $interval(function(){
                getStrava();
              }, 60000 * (60 * 6));//every 6 hours
            }






            $scope.baseCurrency = $scope.objMods.modules[2].baseCurrency.toUpperCase();
            $scope.currencyOne = $scope.objMods.modules[2].currencyOne.toUpperCase();
            $scope.currencyTwo = $scope.objMods.modules[2].currencyTwo.toUpperCase();
            let financeBaseCurrency = $scope.baseCurrency;

            const financeUrl = 'http://api.fixer.io/';
            let financeLatest = financeUrl + 'latest?symbols=' + $scope.currencyOne + ',' + $scope.currencyTwo + '&base=' + $scope.baseCurrency;
            $sce.trustAsResourceUrl(financeLatest);

            const getCurrency = function() {
              $http({
                method: 'GET',
                url: financeLatest
              }).then(function(response) {
                $scope.currOneVal = response.data.rates[$scope.currencyOne];
                $scope.currTwoVal = response.data.rates[$scope.currencyTwo];

              }, function(response) {
                console.log('error', response);
              });
            };

            let repeatCurrency;

            if($scope.objMods.modules[2].active) {
              getCurrency();
              repeatCurrency = $interval(function(){
                $scope.currOneValcopy = angular.copy($scope.currOneVal);
                getCurrency();
                if($scope.currOneVal > $scope.currOneValcopy) {
                  // fall
                  $scope.currencyFall = true;
                }
                else if($scope.currOneVal < $scope.currOneValcopy) {
                  $scope.currencyRise = true;
                  // rise
                } else {
                  // same
                  $scope.currencySame = true;

                }
              }, 60000 * 15);//every 15mins
            }


            const cb = new Codebird();

        		cb.setConsumerKey('gMsM8AJwDYcxhAC4Trg326lp6', 'xgtnNetwamP1j9I1RWyqO5NNpdHw2wuUErqOaPsI8KKK4950o5');
        		cb.setToken('8004102-VuDQ6ED8HZZjZMc7ScQikWlgOnCq4HKxcjLw79S4AH', 'pJ2pRW6iQDp7Aa9mVTqF8xx8RJhs5huIlWttTKLfGEdBm');

            $scope.screenName = $scope.objMods.modules[3].user;

            const twitter = function() {
              $scope.loadingTweets = true;
              cb.__call('statuses_userTimeline', {
                screen_name: $scope.screenName
              }, function (data) {
      						$scope.$apply(function () {
                    $scope.loadingTweets = false;
      							$scope.tweets = data;
      						});
      					}
      				);
            };

            let repeatTweet;

            if($scope.objMods.modules[3].active) {
              twitter();
              repeatTweet = $interval(function(){
                twitter();
              }, 60000 * 5); // 5 mins

            }



            // destroy intervals on state change
            $scope.$on('$destroy', function(){
              $interval.cancel(repeatWeather);
              $interval.cancel(repeatTFL);
              $interval.cancel(repeatStrava);
              $interval.cancel(repeatCurrency);
              $interval.cancel(repeatTweet);
            });

          }).catch(function(error) {
            console.log(error);
          });
        };
        getUserData();
      }
    });

  }]);
})();
