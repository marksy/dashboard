// when it's beer oclock
// make an explosion
// http://www.gameplaypassion.com/blog/explosion-effect-html5-canvas/
// and do a sound


(function() {
  'use strict';
  const moment = require('moment');
  const brexit = document.getElementById("brexit");

  function howLongTilWeBrexit(yeah) {

    let leaveDate = new Date(yeah);
    leaveDate = moment(leaveDate);

    let today = new Date();
    today = moment(today);

    const daysRemaining = leaveDate.diff(today, 'days');

    brexit.innerHTML = `Just ${daysRemaining} days remaining in UK 🇬🇧`;

  }

    howLongTilWeBrexit('2018-05-05T18:00:00Z');


})();
