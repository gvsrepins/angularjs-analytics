# angularjs-analytics
This is a code example of an angular module that facilitates 
the use of event analytics event tracking for multiple provider.

Here is a README documentation template for an AngularJS component:

### Installation

To install this module, you can use npm:

```
npm install angularjs-analytics
```

### Configuration

To install this module, you can use npm:

```
npm install angularjs-analytics
```

### Usage

To use the component, you need to include it in your AngularJS module:

```javascript
angular.module('myApp', ['AnalyticsSender']);
```

Then, you can inject and use the AnalyticsSender on the controller or service you want to use it:

```javascript
(function () {
  'use strict';
 
  angular.module('mlearn.controllers').controller('FAQCtrl', FAQCtrl);

  function FAQCtrl(AnalyticsSender) {
    'ngInject';

    function init() {
      //We will track this event in all providers configured
      AnalyticsSender.trackEvent('FAQSectionOpened');
    }
  }
```

### Configuration

You can configure the analytics providers in the config.json file of your application

```json
{
  "app": {
    "integrations": {
        "analytics_drivers": [
            "FirebaseAnalytics",
            "AmplitudeAnalytics",
            "HotjarAnalytics",
            "NewRelicAnalytics"
        ]
    }
  }
}

```

### API

List the available methods and properties of the component:

### API

List the available methods and properties of the component:

- `init`: Initializes the component.
- `trackPage`: Tracks a page view event.
- `setUserId`: Sets the user ID for tracking purposes.
- `trackEvent`: Tracks a custom event.
- `setUserSource`: Sets the user source for tracking purposes.
- `setMbaInfo`: Sets the MBA (Master of Business Administration) information for tracking purposes.
- `trackException`: Tracks an exception event.
- `trackExitEvent`: Tracks an exit event.
- `setAccessLevel`: Sets the access level for tracking purposes.
- `trackStartEvent`: Tracks a start event.
- `trackLoginEvent`: Tracks a login event.
- `trackOpenedEvent`: Tracks an opened event.
- `trackCompletedEvent`: Tracks a completed event.
- `trackCourseTabEvent`: Tracks a course tab event.
- `trackProfileTabEvent`: Tracks a profile tab event.
- `trackMediaPlayedEvent`: Tracks a media played event.
- `trackMedalsOpenedEvent`: Tracks a medals opened event.
- `trackCourseListTabEvent`: Tracks a course list tab event.
- `trackStartedDownloadEvent`: Tracks a started download event.
- `trackCanceledDownloadEvent`: Tracks a canceled download event.
- `trackCompletedDownloadEvent`: Tracks a completed download event.

### Examples

Provide some usage examples or code snippets:

```javascript
// Example 1
Payments.get().then((response) => {
   //executes the code
})
.catch((error) => {
    //Track error to notify the sysaddmin
    AnalyticsSender.trackException(
    'Error on get payments at financial status controller.',
    error
    );
});
```

```javascript
// Example 2
function save(event) {
      event.preventDefault();
      AnalyticsSender.trackEvent('ButtonClicked', {
        //passing extra parameters
        EventOrigin: $stateParams.from_page,
      });

      //exeutes more code
}
```

### Contributing

If you want to contribute to the development of this component, please follow the guidelines in CONTRIBUTING.md.

### License

This component is licensed under the MIT License. See LICENSE.md for more information.