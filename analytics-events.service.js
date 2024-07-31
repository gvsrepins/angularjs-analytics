(function () {
  'use strict';

  /**
   * @type constant
   * @name mlearn.services.events
   * @description
   * # EVENTS
   * A central configuration for all events send trought the app
   *
   */
  angular.module('angularjs.services.analytics').constant('ANALYTICS_EVENTS', {
    
    SomeEventName: {
      eventCategory: 'SomeEventCategory',
      eventAction: 'SomeEventAction',
      eventLabel: 'Some event description',
      eventValue: null,
    },

  });
})();
