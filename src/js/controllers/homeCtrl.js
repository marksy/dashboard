(() => {
  'use strict';

  let app = angular.module('app');

  app.controller('HomeController', ['$scope', '$state', '$firebaseAuth', '$firebaseObject', '$http', '$interval', '$sce', '$timeout', ($scope, $state, $firebaseAuth, $firebaseObject, $http, $interval, $sce, $timeout) => {

    let vm = $scope;

    const auth = $firebaseAuth();
    let currentLocation;
    let trainLine;

    auth.$onAuthStateChanged((authData) => {
      vm.authData = authData;

      let repeatWeather;
      let repeatTFL;
      let repeatStrava;
      let repeatCurrency;
      let repeatTweet;


      if(authData === null) {
        $state.go('login');
      } else {
        let userId = authData.providerData[0].uid;
        vm.displayName = authData.providerData[0].displayName;
        vm.photoURL = authData.providerData[0].photoURL;

        let getUserData = () => {
          let currentUser = firebase.database().ref().child('/users/' + userId);
          let userExists = $firebaseObject(firebase.database().ref().child('/users/' + userId));

          return currentUser.once('value').then((data) => {
            vm.objMods = data.val();

            currentLocation = vm.objMods.modules[0].location;
            trainLine = vm.objMods.modules[1].lines;

            vm.weatherPanel = vm.objMods.modules[0].active;
            vm.tflPanel = vm.objMods.modules[1].active;
            vm.currencyPanel = vm.objMods.modules[2].active;
            vm.twitterPanel = vm.objMods.modules[3].active;
            vm.stravaPanel = vm.objMods.modules[4].active;


            vm.$apply();





            const key = 'a01445a972f04947b49150500172701';
            if(currentLocation === undefined) {
              currentLocation = 'London';
            }
            let forecastWeatherUrl = 'http://api.apixu.com/v1/forecast.json?key=' + key + '&q=' + currentLocation;

            function fetchForecastWeather() {
              vm.loadingWeatherData = true;
              $http({
                method: 'GET',
                url: forecastWeatherUrl
              }).then((response) => {
                  vm.weatherLocation = response.data.location.name + ', ' + response.data.location.country;
                  vm.weatherData = response.data.current;
                  vm.loadingWeatherData = false;
                  vm.weatherAPImaxedOut = false;

                }, (response) => {
                  console.log('error', response);
                  vm.loadingWeatherData = false;
                  vm.weatherAPImaxedOut = true;
                });
            }

            // if weather is active
            if(vm.objMods.modules[0].active) {
              fetchForecastWeather();

              repeatWeather = $interval(() => {
                fetchForecastWeather();
              }, 900000 * 8); //2 hours
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

            function getTFLStatus() {
              // get trains
              $http({
                method: 'GET',
                url: tflUrl
              }).then(function successCallback(response) {
                  if(response.data.length !== 0) {
                    vm.dataNull = false;
                    vm.trainsArriving = response.data;
                    vm.stationName = response.data[0].stationName;
                  } else {
                    vm.dataNull = true;
                  }
                }, function errorCallback(error) {
                  console.log('error', error);
                });
              //get tube
              $http({
                method: 'GET',
                url: tube
              }).then(function successCallback(response) {
                vm.tube = response.data;
              }, function errorCallback(error) {
                console.log('error', error);
              });
            }

            // if TFL is active
            if(vm.objMods.modules[1].active) {
              getTFLStatus();

              repeatTFL = $interval(() => {
                // fetchCurrentWeather();
                getTFLStatus();
              }, 60000); // every minute
            }




            let stravaAT = '54b0e167486e9e58b52d9b1a73b5471e24c5cf58';
            let stravaUrl = 'https://www.strava.com/api/v3/athlete/activities?access_token=' + stravaAT;
            $sce.trustAsResourceUrl(stravaUrl);

            function getStrava() {
              $http({
                method: 'GET',
                url: stravaUrl
              }).then((response) => {
                  vm.stravaData = response.data;
                }, (response) => {
                  console.log('stravaUrl fail',response);
              });
            }

            // if strava is active
            if(vm.objMods.modules[4].active) {
              getStrava();

              repeatStrava = $interval(() => {
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

            function getCurrency() {
              $http({
                method: 'GET',
                url: financeLatest
              }).then((response) => {
                vm.currOneVal = response.data.rates[vm.currencyOne];
                vm.currTwoVal = response.data.rates[vm.currencyTwo];
                console.log('getCurrency vm.currOneVal: ',vm.currOneVal);
              }, (response) => {
                console.log('error', response);
              });
            }

            // if currency is active
            if(vm.objMods.modules[2].active) {
              getCurrency();
              repeatCurrency = $interval(() => {
                //set currencyDiffs to false
                vm.currencyFall = false;
                vm.currencyRise = false;
                vm.currencySame = false;
                // set copy of currencyVal
                vm.currOneValcopy = vm.currOneVal;
                // update new values
                getCurrency();
                console.log("repeatCurrency vm.currOneVal",vm.currOneVal);
                console.log("repeatCurrency vm.currOneValcopy", vm.currOneValcopy);

                //if old value is greater than new value, fall
                if(vm.currOneValcopy > vm.currOneVal) {
                  vm.currencyFall = true;
                  console.log('vm.currencyFall = true;');
                }
                // if old value is less than new value, rise
                if(vm.currOneValcopy < vm.currOneVal) {
                  vm.currencyRise = true;
                  console.log('vm.currencyRise = true;');
                }
                // values are equal
                if(vm.currOneValcopy === vm.currOneVal) {
                  vm.currencySame = true;
                  console.log('vm.currencySame = true;');
                }

              }, 60000 * 30 ); //every hour
            }


            vm.$on('ngRepeatFinished', function(ngRepeatFinishedEvent) {
              let tweets = document.querySelectorAll('.tweet');

              let timerun = function(tweetIndex,tweetNode) {
                $timeout(function() {
                  tweetNode.classList.add('fade-in');
                }, tweetIndex * 100);
              };

              for(const tweet of tweets.entries()) {
                let tweetIndex = tweet[0];
                let tweetNode = tweet[1];
                timerun(tweetIndex, tweetNode);
              }
            });


            const cb = new Codebird();

        		cb.setConsumerKey('gMsM8AJwDYcxhAC4Trg326lp6', 'xgtnNetwamP1j9I1RWyqO5NNpdHw2wuUErqOaPsI8KKK4950o5');
        		cb.setToken('8004102-VuDQ6ED8HZZjZMc7ScQikWlgOnCq4HKxcjLw79S4AH', 'pJ2pRW6iQDp7Aa9mVTqF8xx8RJhs5huIlWttTKLfGEdBm');

            vm.screenName = vm.objMods.modules[3].user;

            function twitter() {
              vm.loadingTweets = true;
              cb.__call('statuses_userTimeline', {
                screen_name: vm.screenName
              }, function (response) {
      						vm.$apply(() => {
                    vm.loadingTweets = false;
      							vm.tweets = response;
      						});
      					}
      				);
            }


            // if twitter is active
            if(vm.objMods.modules[3].active) {
              twitter();
              repeatTweet = $interval(() => {
                twitter();
              }, 60000 * 5); // 5 mins
            }

          }).catch(function(error) {
            console.log(error);
          });
        };
        getUserData();

      }

      // destroy intervals on state change
      $scope.$on('$destroy', () => {
        $interval.cancel(repeatWeather);
        $interval.cancel(repeatTFL);
        $interval.cancel(repeatStrava);
        $interval.cancel(repeatCurrency);
        $interval.cancel(repeatTweet);
      });

    });

  }]);
})();
