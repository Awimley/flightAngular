(function () {
  
angular.module('flightApp',['ngRoute', 'ngSanitize', 'ui.bootstrap', 'LocalStorageModule', 'n3-line-chart']);

config.$inject = ['$routeProvider', '$locationProvider', 'localStorageServiceProvider'];
function config ($routeProvider, $locationProvider, localStorageServiceProvider) {
  
  $routeProvider
    .when('/', {
      templateUrl: '/login/login.view.html',
      controller: 'loginCtrl',
      controllerAs: 'vm'
    })
    .when('/home', {
      templateUrl: '/home/home.view.html',
      controller: 'homeCtrl',
      controllerAs: 'vm'
    })
    .when('/logs', {
      templateUrl: '/logs/logs.view.html',
      controller: 'logsCtrl',
      controllerAs: 'vm'
    })
    .when('/analysis', {
      templateUrl: '/analysis/analysis.view.html',
      controller: 'analysisCtrl',
      controllerAs: 'vm'
    }) 
    .when('/addUser', {
      templateUrl: '/addUser/addUser.view.html',
      controller: 'addUserCtrl',
      controllerAs: 'vm'
    })
    .otherwise({redirectTo: '/'});

    //remove gnarly /#/ from html route
    $locationProvider.html5Mode(true);

    //Configure local storage
    localStorageServiceProvider
      .setStorageType('localStorage');
}

angular
  .module('flightApp')
  .config(['$routeProvider', '$locationProvider', 'localStorageServiceProvider', config]);
})();