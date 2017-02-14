// when it's beer oclock
// make an explosion
// http://www.gameplaypassion.com/blog/explosion-effect-html5-canvas/
// and do a sound


(function() {
  'use strict';
  const moment = require('moment');
  const runTimestamp = Math.round(Date.now());
  const beer = document.getElementById("beer");
  let intervalCount = 60000 * 60; //every hour

  function beerOclock(beerDay) {

    const dayOfWeek = beerDay || 5;//friday
    const date = new Date(runTimestamp);
    let msg;
    const diff = date.getDay() - dayOfWeek;
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
      intervalCount = 60000;
    }

    msg = "Beer o'clock " + moment(date).fromNow();

    if(msg === "Beer o'clock in 4 days") {
      msg = "Beer o'clock in 4 days. Happy Monday etc. 😐";
    }

    if(msg === "Beer o'clock in 3 days") {
      msg = "Beer o'clock in 3 days. Tuesday";
    }

    if(msg === "Beer o'clock in 2 days") {
      msg = "Beer o'clock in 2 days. Hump day innit. 😉";
    }

    if(msg === "Beer o'clock in 1 day") {
      msg = "Beer o'clock in 1 day. Come on! 😀";
    }

    if(msg === "Beer o'clock in 3 hours") {
      msg = "Beer o'clock in <span class='flash'>3 hours!</span>";
    }
    if(msg === "Beer o'clock in 2 hours") {
      msg = "Beer o'clock in <span class='flash'>2 hours!! 🍺</span>";
    }
    if(msg === "Beer o'clock in 1 hour") {
      msg = "Beer o'clock in <span class='flash'>1 hour!!! 🍺🍻</span>";
    }
    if(msg === "Beer o'clock in 3 minutes" ||
    msg === "Beer o'clock in 2 minutes" ||
    msg === "Beer o'clock in 1 minute" ) {
      msg = "HOLY SHIT. Beer o'clock <span class='flash'>in a few minutes!!!!!!1🍻🍻</span>🍺🍺🍺🍺🍺🍺🍺🍺🍺🍺🍺";
    }

    setTimeout(function() {
      beer.innerHTML = msg;
    }, 100);

  }

    beerOclock();

    setInterval(function() {
      beerOclock();
    }, intervalCount);

})();
