(function () {
  'use strict';

  angular
    .module('angularjs.services.analytics')
    .service('WebFirebaseAnalytics', WebFirebaseAnalytics);

  function WebFirebaseAnalytics($window) {
    'ngInject';

    var analytics = false;

    return {
      init: init,
      setUserId: setUserId,
      trackEvent: trackEvent,
      setCustomDimension: setCustomDimension,
    };

    function init() {
      if ($window.firebase && !analytics) {
        analytics = $window.firebase.analytics();
      }
    }

    function trackEvent(eventName, params) {
      analytics.logEvent(eventName, params);
    }

    function setUserId(userId) {
      return analytics.setUserId(userId);
    }

    function setCustomDimension(key, value) {
      var property = {};
      property[key] = value;
      return analytics.setUserProperties(property);
    }
  }
})();
