(function () {
  'use strict';

  angular
    .module('angularjs.services.analytics')
    .service('CordovaFirebaseAnalytics', CordovaFirebaseAnalytics);

  function CordovaFirebaseAnalytics(
    $window,
    APP_SETTINGS,
    $q,
    $log,
    $ionicPlatform,
    device
  ) {
    'ngInject';

    var initialized = false;

    return {
      init: init,
      setUserId: setUserId,
      trackEvent: trackEvent,
      setCustomDimension: setCustomDimension,
    };

    function init() {
      return $ionicPlatform.ready().then(() => {
        if ($window.FirebasePlugin && !initialized) {
          initialized = true;
        }
      });
    }

    function trackEvent(eventName, params) {
      return init().then(() => {
        if (device.isNativeMobileApp()) {
          $window.FirebasePlugin.logEvent(
            eventName,
            params,
            () => {
              $log.log(eventName, 'logged with success!');
            },
            (error) => {
              $log.error(error);
            }
          );
        }
      });
    }

    function setUserId(userId) {
      return init().then(() => {
        return $window.FirebasePlugin.setUserId(userId);
      });
    }

    function setCustomDimension(key, value) {
      return init().then(() => {
        return $window.FirebasePlugin.setUserProperty(key, value);
      });
    }
  }
})();
