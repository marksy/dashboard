(function() {
  'use strict';
  var moment = require('moment');
  var runTimestamp = Math.round(Date.now());
  var intervalCount = 60000; //every minute

  function beerOclock(beerDay) {

    var dayOfWeek = beerDay || 5;//friday
    var date = new Date(runTimestamp);
    var msg;
    var diff = date.getDay() - dayOfWeek;
    if (diff > 0) {
        date.setDate(date.getDate() + 6);
    }
    else if (diff < 0) {
        date.setDate(date.getDate() + ((-1) * diff));
    }
    date.setHours(17);
    date.setMinutes(0);
    date.setSeconds(0);

    //on the day speed up the intervalCount
    if(diff === 0) {
      intervalCount = 1000;
    }

    msg = "Beer o'clock " + moment(date).fromNow();
    console.log(msg);

    setTimeout(function() {
      var beer = document.getElementById("beer");
      beer.innerHTML = msg;
      // console.log(beer);
    }, 100);

  }

    beerOclock();

    setInterval(function() {
      beerOclock();
    }, intervalCount);

})();
