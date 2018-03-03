// when it's beer oclock
// make an explosion
// http://www.gameplaypassion.com/blog/explosion-effect-html5-canvas/
// and do a sound


(function() {
  'use strict';
  const moment = require('moment');
  const brexit = document.getElementById("brexit");

  function howLongTilWeBrexit() {

    let leaveDate = new Date('2018-04-05T18:00:00Z');
    leaveDate = moment(leaveDate);

    let today = new Date();
    today = moment(today);

    const daysRemaining = leaveDate.diff(today, 'days');
    console.log('daysRemaining',daysRemaining);

    brexit.innerHTML = `Just ${daysRemaining} days remaining in UK 🇬🇧`;

  }

    howLongTilWeBrexit();


})();
