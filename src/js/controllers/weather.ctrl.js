const key = 'afe63dfdbc9e4881bae163028172702';
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
if(vm.weatherPanel) {
  fetchForecastWeather();

  repeatWeather = $interval(() => {
    fetchForecastWeather();
  }, 900000 * 8); //2 hours
}
