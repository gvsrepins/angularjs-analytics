(function () {
  'use strict';

  angular
    .module('angularjs.services.analytics')
    .factory('AdjustAnalytics', AdjustAnalytics);

  function AdjustAnalytics(
    $window,
    $ionicPlatform,
    $q,
    $log,
    device,
    APP_SETTINGS
  ) {
    'ngInject';

    var Adjust;
    var appToken = APP_SETTINGS.integrations.adjust.app_token;
    var environment = APP_SETTINGS.integrations.adjust.env;
    var initialized = false;
    this.nativeOnly = true;

    return { init: init, trackEvent: trackEvent };

    function init() {
      var deferred = $q.defer();

      if (!device.isNativeMobileApp()) {
        deferred.reject('AdjustAnalytics is not supported on this platform.');
        return deferred.promise;
      }

      if (!APP_SETTINGS.integrations.adjust.active) {
        deferred.reject('AdjustAnalytics is not active.');
        return deferred.promise;
      }

      return $ionicPlatform.ready().then(() => {
        if ($window.Adjust && !initialized) {
          var config = getAdjustConfig(appToken, environment);
          Adjust = $window.Adjust.create(config);
          initialized = true;
        }
      });
    }

    function trackEvent(eventName, params) {
      var events = APP_SETTINGS.integrations.adjust.events;

      if (!events.hasOwnProperty(eventName)) {
        return;
      }

      return init()
        .then(() => {
          Object.keys(params).forEach(function (key) {
            Adjust.addCallbackParameter(key, params[key]);
          });

          return Adjust.trackEvent(events[eventName]);
        })
        .catch(function (error) {
          $log.info(error);
        });
    }

    function getAdjustConfig(appToken, environment) {
      var config;
      var AdjustConfig = $window.AdjustConfig;

      if (environment === 'sandbox') {
        config = new AdjustConfig(appToken, AdjustConfig.EnvironmentSandbox);
        config.setLogLevel(AdjustConfig.LogLevelVerbose);
      }

      if (environment === 'production') {
        config = new AdjustConfig(appToken, AdjustConfig.EnvironmentProduction);
        config.setLogLevel(AdjustConfig.LogLevelSuppress);
      }

      config.setAttributionCallbackListener(function (attribution) {
        //Printing all attribution properties.
        $log.info('Attribution changed!');
        $log.info(attribution.trackerToken);
        $log.info(attribution.trackerName);
        $log.info(attribution.network);
        $log.info(attribution.campaign);
        $log.info(attribution.adgroup);
        $log.info(attribution.creative);
        $log.info(attribution.clickLabel);
        $log.info(attribution.adid);
      });

      return config;
    }
  }
})();
