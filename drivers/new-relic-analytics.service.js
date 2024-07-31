(function () {
  'use strict';

  angular
    .module('angularjs.services.analytics')
    .service('NewRelicAnalytics', NewRelicAnalytics);

  function NewRelicAnalytics($log, $q, $window, APP_SETTINGS) {
    'ngInject';

    let provider;

    return {
      init: init,
      trackException,
      setAppVersion,
      setUserId,
      setCustomDimension,
    };

    function isActive() {
      return APP_SETTINGS.integrations.new_relic.active;
    }

    function init() {
      if (!isActive() || !!provider) {
        return $q.resolve();
      }

      provider = $window.newrelic;

      if (!provider) {
        $log.error('NewRelic not found');
      }

      return $q.resolve();
    }

    function trackException(description, error, params) {
      return init().then(() => {
        if (!provider) {
          return;
        }

        provider.noticeError(error, { ...params, description });
      });
    }

    function setAppVersion(version) {
      return init().then(() => {
        if (!provider) {
          return;
        }

        provider.addRelease('app', version);
        setCustomDimension('app_version', version);
      });
    }

    function setUserId(user_id) {
      return setCustomDimension('user_id', user_id);
    }

    function setCustomDimension(key, value) {
      return init().then(() => {
        if (!provider) {
          return;
        }

        provider.setCustomAttribute(key, value);
      });
    }
  }
})();
