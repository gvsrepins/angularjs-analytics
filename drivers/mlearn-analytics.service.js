(function () {
  'use strict';

  angular
    .module('angularjs.services.analytics')
    .factory('MlearnAnalytics', MlearnAnalytics);

  function MlearnAnalytics() {
    'ngInject';

    return {
      init: init,
      trackEvent: trackEvent,
    };

    function init() {
      console.log('init from mlearnAnalytics');
    }

    function trackEvent(eventName, params) {
      console.log('mlearnAnalytics', eventName, params);
    }
  }
})();
