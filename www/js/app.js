angular.module('dalfey', ['ionic', 'dalfey.controllers','dalfey.services'])

.constant("settings", {
        "url": "http://localhost",
        "port": "80"
})

.run(['$ionicPlatform', function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
}])

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {

  $ionicConfigProvider.backButton.previousTitleText(false).text('');
  $ionicConfigProvider.views.swipeBackEnabled(false);
  $ionicConfigProvider.views.maxCache(0);

  $stateProvider
  .state('home', {
    url: "/home",
    templateUrl: "templates/home.html",
    controller: 'HomeCtrl'
  })
  .state('labor', {
    url: "/labor",
    data: {
      step: 1
    },
    templateUrl: "templates/labor.html",
    controller: 'Step1Ctrl'
  })
  .state('machine', {
    url: "/machine",
    data: {
      step: 2
    },
    templateUrl: "templates/machine.html",
    controller: 'Step2Ctrl'
  })
  .state('services', {
    url: "/services",
    data: {
      step: 3
    },
    templateUrl: "templates/services.html",
    controller: 'Step3Ctrl'
  })
  .state('review', {
    url: "/review",
    data: {
      step: 4
    },
    templateUrl: "templates/review.html",
    controller: 'DoneCtrl'
  });

  $urlRouterProvider.otherwise("/home");
});