(function () {
  'use strict';

  angular
    .module('angularjs.services.analytics')
    .factory('GoogleAnalytics', GoogleAnalytics);

  function GoogleAnalytics($q, WebAnalytics) {
    'ngInject';

    var provider;

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
      var defer = $q.defer();

      if (!!provider) {
        defer.resolve();
        return defer.promise;
      }

      provider = WebAnalytics;
      provider.init();

      defer.resolve();
      return defer.promise;
    }

    function trackPage(title, label) {
      return init().then(() => {
        return provider.trackPage(title, label);
      });
    }

    function trackEvent(eventName, params) {
      return init().then(() => {
        return provider.trackEvent(eventName, params);
      });
    }

    function trackException(description, fatal) {
      return init().then(() => {
        return provider.trackException(description, fatal);
      });
    }

    function setUserId(userId) {
      return init().then(() => {
        return provider.setUserId(userId);
      });
    }

    function setAppVersion(version) {
      return init().then(() => {
        return provider.setAppVersion(version);
      });
    }

    function setCustomDimension(key, value) {
      return init().then(() => {
        return provider.setCustomDimension(key, value);
      });
    }
  }
})();
