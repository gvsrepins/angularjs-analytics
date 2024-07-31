(function () {
  'use strict';

  angular
    .module('angularjs.services.analytics')
    .factory('AnalyticsSender', AnalyticsSender);

  /**
   * AnalyticsSender is a service responsible for sending analytics events to various providers.
   *
   * @param {Object} $injector - AngularJS injector service.
   * @param {Object} $log - AngularJS logging service.
   * @param {Object} $window - AngularJS window service.
   * @param {Object} AUTH_PROVIDERS - Object containing authentication provider constants.
   * @param {Object} ANALYTICS_EVENTS - Object containing registered analytics event names.
   * @param {Object} APP_SETTINGS - Object containing application settings.
   * @param {Object} device - Object containing device-related information.
   * @returns {Object} - An object with methods for initializing, tracking events, and setting user parameters.
   */
  function AnalyticsSender(
    $injector,
    $log,
    $window,
    AUTH_PROVIDERS,
    ANALYTICS_EVENTS,
    APP_SETTINGS,
    device,
  ) {
    'ngInject';

    var providers = APP_SETTINGS.integrations.analytics_drivers;

    return {
      init: init,
      trackPage: trackPage,
      setUserId: setUserId,
      trackEvent: trackEvent,
      setUserSource: setUserSource,
      setMbaInfo: setMbaInfo,
      trackException: trackException,
      trackExitEvent: trackExitEvent,
      setAccessLevel: setAccessLevel,
      trackStartEvent: trackStartEvent,
      trackLoginEvent: trackLoginEvent,
      trackOpenedEvent: trackOpenedEvent,
      trackCompletedEvent: trackCompletedEvent,
      trackCourseTabEvent: trackCourseTabEvent,
      trackProfileTabEvent: trackProfileTabEvent,
      trackMediaPlayedEvent: trackMediaPlayedEvent,
      trackMedalsOpenedEvent: trackMedalsOpenedEvent,
      trackCourseListTabEvent: trackCourseListTabEvent,
      trackStartedDownloadEvent: trackStartedDownloadEvent,
      trackCanceledDownloadEvent: trackCanceledDownloadEvent,
      trackCompletedDownloadEvent: trackCompletedDownloadEvent,
    };

    function execute(method, args) {
      const executedProviders = providers
        .map((providerName) => ({
          providerName,
          provider: $injector.get(providerName),
        }))
        .filter(({ provider }) => shouldExecute(provider, method))
        .map(({ providerName, provider }) => {
          provider[method].apply(provider, args);
          return { providerName, provider };
        });

      const providersName = executedProviders.map(
        ({ providerName }) => providerName
      );

      $log.debug(
        '[Analytics sender]: execute method',
        method,
        args,
        providersName
      );

      return false;
    }

    function shouldExecute(provider, method) {
      // Checks if provider has the method implemented.
      if (!provider.hasOwnProperty(method)) {
        return false;
      }

      // Checks if provider is flaged to only execute in native apps
      if (provider.hasOwnProperty('nativeOnly') && provider.nativeOnly) {
        return device.isNativeMobileApp();
      }

      return true;
    }

    function init() {
      const promise = execute('init');
      setBasicDimensions();

      return promise;
    }

    function trackPage(path, label) {
      const origin = $window.location.origin;
      const location = `${origin}${path}`;

      trackEvent('page_view', {
        page_location: location,
        page_path: `${path}`,
        page_title: label,
      });

      return execute('trackPage', [path, label]);
    }

    function trackEvent(eventName, opts) {
      if (!_.hasIn(ANALYTICS_EVENTS, eventName)) {
        $log.error(`${eventName} is not registered.`);
        return false;
      }

      var eventObject = {
        ...ANALYTICS_EVENTS[eventName],
        ...opts,
        isOnline: device.isOnline(),
      };

      return execute('trackEvent', [eventName, eventObject]);
    }

    function trackException(info, error, data) {
      try {
        if (!(error instanceof Error)) {
          data = getNewErrorDataObject(error, data);
          error = null;
        }

        if (!error) {
          error = new Error(data?.message || info);
        }

        if (!error.message) {
          error.message = info;
        }

        printExceptionLog(info, error, data);

        const params = { ...data, isOnline: device.isOnline() };
        const description = info || error.message;
        return execute('trackException', [description, error, params]);
      } catch (error) {
        $log.error('Error on trackException:', error);
      }
    }

    function getNewErrorDataObject(error, data) {
      if (!error) {
        return { ...data };
      }

      if (typeof error === 'string') {
        return { message: error, ...data };
      }

      if (typeof error === 'object') {
        return {
          code: error.code,
          message: error.message,
          ...error,
          ...data,
        };
      }
    }

    function printExceptionLog(info, error, data) {
      console.error(error, { info, data });
    }

    function setUserId(userId) {
      return execute('setUserId', [userId]);
    }

    function setCustomDimension(key, value) {
      return execute('setCustomDimension', [key, value]);
    }

    function setAccessLevel(value) {
      setCustomDimension('access_level', value);
    }

    function setUserSource(value) {
      setCustomDimension('user_source', value);
    }

    function setMbaInfo(has_mba, activated_mba_at) {
      setCustomDimension('has_mba', has_mba);

      if (!!activated_mba_at) {
        setCustomDimension('activated_mba_at', activated_mba_at);
      }
    }

    function trackLoginEvent(context, data) {
      switch (context) {
        case 'sign-up':
          return trackEvent('SignedUpWithoutFirebase', { context, ...data });
        case 'sms':
          return trackEvent('LoggedWithSMS', { context, ...data });

        case 'cpf':
          return trackEvent('LoggedWithCpf', { context, ...data });

        case 'facebook':
          return trackEvent('LoggedWithFacebook', { context, ...data });

        case AUTH_PROVIDERS.FIREBASE:
          return trackEvent('LoggedWithFirebase', { context, ...data });

        case 'google':
          return trackEvent('LoggedWithGoogle', { context, ...data });

        case 'magic-link':
          return trackEvent('LoggedWithMagicLink', { context, ...data });

        case 'msisdn-password':
          return trackEvent('LoggedWithPhoneNumber', { context, ...data });

        case 'email-password':
          return trackEvent('LoggedWithEmail', { context, ...data });

        case AUTH_PROVIDERS.PARTNERS:
          return trackEvent('LoggedWithPartner', { context, ...data });
      }

      return trackEvent('LoggedWithUnknownProvider', { context, ...data });
    }

    function trackOpenedEvent(context, label) {
      switch (context) {
        case 'extraContentList':
          return trackEvent('ExtraContentListOpened', {
            eventLabel: label,
          });
        case 'extraContent':
          return trackEvent('ExtraContentOpened', {
            eventLabel: label,
          });

        case 'newsList':
          return trackEvent('NewsListOpened', {
            eventLabel: label,
          });

        case 'newsItem':
          return trackEvent('NewsItemOpened', {
            eventLabel: label,
          });
      }
    }

    function trackMedalsOpenedEvent(context, label) {
      switch (context) {
        case 'dashboard':
          return trackEvent('EarnedMedalsOpened', {
            eventCategory: 'Dashboard',
            eventLabel: label,
          });
        case 'profile':
          return trackEvent('EarnedMedalsOpened', {
            eventCategory: 'Profile',
            eventLabel: label,
          });
        case 'medals':
          return trackEvent('EarnedMedalsOpened', {
            eventCategory: 'Medals',
            eventLabel: label,
          });
        default:
          return trackEvent('EarnedMedalsOpened', {
            eventCategory: 'Course',
            eventLabel: label,
          });
      }
    }

    function trackExitEvent(context, label) {
      switch (context) {
        case 'lesson':
          return trackEvent('LessonAbandoned', {
            eventLabel: label,
          });
        case 'practice':
          return trackEvent('PracticeAbandoned', {
            eventLabel: label,
          });
        case 'finalTest':
          return trackEvent('FinalTestAbandoned', {
            eventLabel: label,
          });
      }
    }

    function trackProfileTabEvent(context, label) {
      switch (context) {
        case 'summary':
          return trackEvent('ProfileSummaryOpened', {
            eventLabel: label,
          });
        case 'ranking':
          return trackEvent('ProfileRankingOpened', {
            eventLabel: label,
          });
        case 'medals':
          return trackEvent('ProfileMedalsOpened', {
            eventLabel: label,
          });
      }
    }

    function trackCourseTabEvent(context, label) {
      switch (context) {
        case 'home':
          return trackEvent('CourseHomeOpened', {
            eventLabel: label,
          });
        case 'materials':
          return trackEvent('MaterialsSectionOpened', {
            eventLabel: label,
          });
        case 'medals':
          return trackEvent('MedalsSectionOpened', {
            eventLabel: label,
          });
        case 'progress':
          return trackEvent('ProgressSectionOpened', {
            eventLabel: label,
          });
      }
    }

    function trackCourseListTabEvent(context) {
      switch (context) {
        case 'allCourses':
          return trackEvent('CoursesListAreaOpened');
        case 'completedCourses':
          return trackEvent('CompletedCoursesAreaOpened');
        case 'certificates':
        case 'certificatesInfo':
          return trackEvent('CoursesCertificatesPageOpened', {
            Status: getCertificatePageTitle(context),
          });
      }
    }

    function getCertificatePageTitle(context) {
      if (context === 'certificatesInfo') {
        return 'CoursesCertificatesPageIntroduction';
      }

      return 'CoursesCertificatesPage';
    }

    function trackStartEvent(context, label) {
      switch (context) {
        case 'module':
          return trackEvent('ModuleStarted', {
            eventLabel: label,
          });
      }
    }

    function trackCompletedEvent(context, label) {
      switch (context) {
        case 'InAppSubscription':
          return trackEvent('InAppSubscriptionCompleted', {
            eventLabel: label,
          });
      }
    }

    function trackStartedDownloadEvent(context, label) {
      switch (context) {
        case 'downloadModule':
          return trackEvent('ModuleDownloadedStarted', {
            eventLabel: label,
          });
        case 'downloadContent':
          return trackEvent('ContentDownloadedStarted', {
            eventLabel: label,
          });
      }
    }

    function trackCanceledDownloadEvent(context, label) {
      switch (context) {
        case 'downloadCourse':
          return trackEvent('CourseDownloadedCanceled', {
            eventLabel: label,
          });
        case 'downloadModule':
          return trackEvent('ModuleDownloadedCanceled', {
            eventLabel: label,
          });
        case 'downloadContent':
          return trackEvent('ContentDownloadedCanceled', {
            eventLabel: label,
          });
      }
    }

    function trackCompletedDownloadEvent(context, label) {
      switch (context) {
        case 'downloadCourse':
          return trackEvent('CourseDownloadedCompleted', {
            eventLabel: label,
          });
        case 'downloadModule':
          return trackEvent('ModuleDownloadedCompleted', {
            eventLabel: label,
          });
        case 'downloadContent':
          return trackEvent('ContentDownloadedCompleted', {
            eventLabel: label,
          });
        case 'downloadCertificate':
          return trackEvent('CertificateDownloaded', {
            eventLabel: label,
          });
      }
    }

    function trackMediaPlayedEvent(context, label, value) {
      switch (context) {
        case 'video':
          return trackEvent('VideoMediaPlayed', {
            eventLabel: label,
            eventValue: value,
          });
        case 'audio':
          return trackEvent('AudioMediaPlayed', {
            eventLabel: label,
            eventValue: value,
          });
      }
    }

    function setBasicDimensions() {
      setAppVersion();
      setServiceId();
      setDeviceInformations();
    }

    function setAppVersion() {
      const version = APP_SETTINGS.platform.version;
      return execute('setAppVersion', [version]);
    }

    function setServiceId() {
      const service_id = APP_SETTINGS.app.service_id;
      setCustomDimension('service_id', service_id);
    }

    function setDeviceInformations() {
      const isNativeMobileApp = device.isNativeMobileApp();
      setCustomDimension('isNativeMobileApp', isNativeMobileApp);
    }
  }
})();
