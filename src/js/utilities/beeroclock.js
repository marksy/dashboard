// when it's beer oclock
// make an explosion
// http://www.gameplaypassion.com/blog/explosion-effect-html5-canvas/
// and do a sound


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


    if(msg === "Beer o'clock in 3 hours") {
      msg = "Beer o'clock in <span class='flash'>3 hours!</span>";
    }
    if(msg === "Beer o'clock in 2 hours") {
      msg = "Beer o'clock in <span class='flash'>2 hours!! 🍺</span>";
    }
    if(msg === "Beer o'clock in 1 hour") {
      msg = "Beer o'clock in <span class='flash'>1 hour!!! 🍺🍻</span>";
    }
    if(msg === "Beer o'clock in 3 minutes 🍺🍺🍺🍺" ||
    msg === "Beer o'clock in 2 minutes 🍺🍺🍺🍺🍺🍺" ||
    msg === "Beer o'clock in 1 minute 🍺🍺🍺🍺🍺🍺🍺🍺" ) {
      msg = "HOLY SHIT. Beer o'clock <span class='flash'>in a few minutes!!!!!!1🍻🍻</span>🍺🍺🍺🍺🍺🍺🍺🍺🍺🍺🍺";
    }

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
