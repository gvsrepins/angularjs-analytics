(function () {
  'use strict';

  angular
    .module('angularjs.services.analytics')
    .service('HotjarAnalytics', HotjarAnalytics);

  function HotjarAnalytics($q, $window) {
    'ngInject';

    return {
      setUserId,
    };

    function setUserId(userId) {
      if (!$window.hj) {
        return $q.resolve();
      }

      $window.hj('identify', userId, {});
      return $q.resolve();
    }
  }
})();
