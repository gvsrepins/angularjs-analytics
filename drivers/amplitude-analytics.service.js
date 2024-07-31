(function () {
  'use strict';

  angular
    .module('angularjs.services.analytics')
    .service('AmplitudeAnalytics', AmplitudeAnalytics);

  function AmplitudeAnalytics($window) {
    'ngInject';

    var analytics = $window.amplitude.getInstance();

    return {
      init: init,
      setUserId: setUserId,
      setAppVersion: setAppVersion,
      trackEvent: trackEvent,
      setCustomDimension: setCustomDimension,
    };

    function init() {}

    function trackEvent(eventName, params) {
      return analytics.logEvent(eventName, params);
    }

    function setUserId(userId) {
      return analytics.setUserId(userId);
    }

    function setCustomDimension(key, value) {
      var property = {};
      property[key] = value;

      return analytics.setUserProperties(property);
    }

    function setAppVersion(version) {
      return analytics.setVersionName(version);
    }
  }
})();
