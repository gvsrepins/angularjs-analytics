(function () {
  'use strict';

  angular
    .module('angularjs.services.analytics')
    .service('FirebaseAnalytics', FirebaseAnalytics);

  function FirebaseAnalytics(
    $q,
    $ionicPlatform,
    CordovaFirebaseAnalytics,
    WebFirebaseAnalytics,
    device
  ) {
    'ngInject';

    var provider;

    return {
      init: init,
      setUserId: setUserId,
      trackEvent: trackEvent,
      setCustomDimension: setCustomDimension,
    };

    function init() {
      var defer = $q.defer();

      if (!!provider) {
        defer.resolve();
        return defer.promise;
      }

      if (device.isNativeMobileApp()) {
        return $ionicPlatform.ready().then(() => {
          provider = CordovaFirebaseAnalytics;
          provider.init();
        });
      }

      provider = WebFirebaseAnalytics;
      provider.init();

      defer.resolve();
      return defer.promise;
    }

    function trackEvent(eventName, params) {
      return init().then(() => {
        return provider.trackEvent(eventName, params);
      });
    }

    function setUserId(userId) {
      return init().then(() => {
        return provider.setUserId(userId);
      });
    }

    function setCustomDimension(key, value) {
      return init().then(() => {
        return provider.setCustomDimension(key, value);
      });
    }
  }
})();
