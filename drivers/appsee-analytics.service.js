(function () {
  'use strict';

  angular
    .module('angularjs.services.analytics')
    .factory('AppseeAnalytics', AppseeAnalytics);

  function AppseeAnalytics($window, $ionicPlatform, $q, $log, device) {
    'ngInject';

    return {
      nativeOnly: true,
      init: init,
      trackPage: trackPage,
      trackEvent: trackEvent,
    };

    function init() {
      var defer = $q.defer();

      if (!device.isNativeMobileApp()) {
        defer.reject('AppseeAnalytics is not supported on this platform.');
        return defer.promise;
      }

      return $ionicPlatform.ready();
    }

    function trackPage(title, label) {
      return init()
        .then(() => {
          if ($window.Appsee) {
            return $window.Appsee.startScreen(label);
          }
        })
        .catch((error) => {
          $log.log(error);
        });
    }

    function trackEvent(eventName) {
      return init()
        .then(() => {
          if ($window.Appsee) {
            $window.Appsee.addEvent(
              eventName,
              () => {},
              () => {}
            );
          }
        })
        .catch((error) => {
          $log.log(error);
        });
    }
  }
})();
