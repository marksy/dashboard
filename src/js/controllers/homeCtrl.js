(function() {
  'use strict';

  let app = angular.module('app');

  app.controller('HomeController', ['$scope', '$state', '$firebaseAuth', '$firebaseObject', '$http', '$interval', '$sce', '$timeout', function($scope, $state, $firebaseAuth, $firebaseObject, $http, $interval, $sce, $timeout) {

    let vm = $scope;

    const auth = $firebaseAuth();
    let currentLocation;
    let trainLine;

    auth.$onAuthStateChanged(function(authData) {
      vm.authData = authData;

      if(authData === null) {
        $state.go('login');
      } else {
        let userId = authData.providerData[0].uid;
        vm.displayName = authData.providerData[0].displayName;
        vm.photoURL = authData.providerData[0].photoURL;

        let getUserData = function() {
          let currentUser = firebase.database().ref().child('/users/' + userId);
          let userExists = $firebaseObject(firebase.database().ref().child('/users/' + userId));

          return currentUser.once('value').then(function(data) {
            if(data.val() !== null) {
              vm.objMods = data.val();

              currentLocation = vm.objMods.modules[0].location;
              trainLine = vm.objMods.modules[1].lines;

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





            const key = 'a01445a972f04947b49150500172701';
            if(currentLocation === undefined) {
              currentLocation = 'London';
            }
            let forecastWeatherUrl = 'http://api.apixu.com/v1/forecast.json?key=' + key + '&q=' + currentLocation;

            const fetchForecastWeather = function() {
              vm.loadingWeatherData = true;
              $http({
                method: 'GET',
                url: forecastWeatherUrl
              }).then(function(response) {
                  vm.weatherLocation = response.data.location.name + ', ' + response.data.location.country;
                  vm.weatherData = response.data.current;
                  vm.loadingWeatherData = false;

                }, function(response) {
                  console.log('error', response);
                  vm.loadingWeatherData = false;
                });
            };

            let repeatWeather;

            if(vm.objMods.modules[0].active) {
              fetchForecastWeather();

              repeatWeather = $interval(function(){
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

            console.log('tflUrl',tflUrl);

            const getTFLStatus = function() {
              // get trains
              $http({
                method: 'GET',
                url: tflUrl
              }).then(function successCallback(data) {
                  if(data.data.length !== 0) {
                    vm.trainsArriving = data.data;
                    vm.stationName = data.data[0].stationName;
                  } else {
                    vm.dataNull = 'STUPID TFL DATA ERROR. ';
                  }
                }, function errorCallback(error) {
                  console.log('error', error);
                });
              //get tube
              $http({
                method: 'GET',
                url: tube
              }).then(function successCallback(data) {
                vm.tube = data.data;
              }, function errorCallback(error) {
                console.log('error', error);
              });
            };

            let repeatTFL;

            if(vm.objMods.modules[1].active) {
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
                  vm.stravaData = response.data;
                }, function(response) {
                  console.log('stravaUrl fail',response);
              });
            };

            let repeatStrava;

            if(vm.objMods.modules[4].active) {
              getStrava();

              repeatStrava = $interval(function(){
                getStrava();
              }, 60000 * (60 * 6));//every 6 hours
            }





            vm.baseCurrency = vm.objMods.modules[2].baseCurrency.toUpperCase();
            vm.currencyOne = vm.objMods.modules[2].currencyOne.toUpperCase();
            vm.currencyTwo = vm.objMods.modules[2].currencyTwo.toUpperCase();
            let financeBaseCurrency = vm.baseCurrency;

            const financeUrl = 'http://api.fixer.io/';
            let financeLatest = financeUrl + 'latest?symbols=' + vm.currencyOne + ',' + vm.currencyTwo + '&base=' + vm.baseCurrency;
            $sce.trustAsResourceUrl(financeLatest);

            const getCurrency = function() {
              $http({
                method: 'GET',
                url: financeLatest
              }).then(function(response) {
                vm.currOneVal = response.data.rates[vm.currencyOne];
                vm.currTwoVal = response.data.rates[vm.currencyTwo];

              }, function(response) {
                console.log('error', response);
              });
            };

            let repeatCurrency;

            if(vm.objMods.modules[2].active) {
              getCurrency();
              repeatCurrency = $interval(function(){
                vm.currOneValcopy = vm.currOneVal;
                getCurrency();
                console.log(vm.currOneValcopy,vm.currOneVal);
              }, 60000 * 15);
              vm.currencyFall = false;
              vm.currencyRise = false;
              vm.currencySame = false;
              if(vm.currOneValcopy > vm.currOneVal) {
                vm.currencyFall = true;
              }
              if(vm.currOneValcopy < vm.currOneVal) {
                vm.currencyRise = true;
              }
              if(vm.currOneValcopy === vm.currOneVal) {
                vm.currencySame = true;
              }
            }




            const cb = new Codebird();

        		cb.setConsumerKey('gMsM8AJwDYcxhAC4Trg326lp6', 'xgtnNetwamP1j9I1RWyqO5NNpdHw2wuUErqOaPsI8KKK4950o5');
        		cb.setToken('8004102-VuDQ6ED8HZZjZMc7ScQikWlgOnCq4HKxcjLw79S4AH', 'pJ2pRW6iQDp7Aa9mVTqF8xx8RJhs5huIlWttTKLfGEdBm');

            vm.screenName = vm.objMods.modules[3].user;

            const twitter = function() {
              vm.loadingTweets = true;
              cb.__call('statuses_userTimeline', {
                screen_name: vm.screenName
              }, function (data) {
      						vm.$apply(function () {
                    vm.loadingTweets = false;
      							vm.tweets = data;
      						});
      					}
      				);
            };

            let repeatTweet;

            if(vm.objMods.modules[3].active) {
              twitter();
              repeatTweet = $interval(function(){
                twitter();
              }, 60000 * 5); // 5 mins

            }


            // destroy intervals on state change
            vm.$on('$destroy', function(){
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
