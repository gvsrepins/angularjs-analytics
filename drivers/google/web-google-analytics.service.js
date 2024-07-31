(function () {
  'use strict';

  angular
    .module('angularjs.services.analytics')
    .factory('WebAnalytics', WebAnalytics);

  function WebAnalytics(Analytics) {
    'ngInject';

    return {
      init: init,
      trackPage: trackPage,
      setUserId: setUserId,
      trackEvent: trackEvent,
      setAppVersion: setAppVersion,
      trackException: trackException,
      setCustomDimension: setCustomDimension,
    };

    function init() {
      Analytics.pageView();
    }

    function trackPage(title, label) {
      return Analytics.trackPage(title, label);
    }

    function trackEvent(eventName, params) {
      return Analytics.trackEvent(
        params.eventCategory,
        params.eventAction,
        params.eventLabel,
        params.eventValue
      );
    }

    function trackException(description) {
      return Analytics.trackException(description, false);
    }

    function setUserId(userId) {
      return Analytics.set('&uid', userId);
    }

    function setAppVersion(version) {
      return Analytics.set('appVersion', version);
    }

    function setCustomDimension(key, value) {
      var customDimensions = {
        access_level: 1,
        user_source: 2,
      };

      if (customDimensions.hasOwnProperty(key)) {
        key = customDimensions[key];
      }

      return Analytics.set(`dimension${key}`, value);
    }
  }
})();
