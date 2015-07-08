(function () {
  
  angular
    .module('flightApp')
    .controller('loginCtrl', loginCtrl);

  loginCtrl.$inject = ['$location', '$scope', 'flightData', '$log', 'localStorageService', '$location']
  function loginCtrl($location, $scope, flightData, $log, localStorageService, $location) {
    var vm = this;
    vm.data = {};
    vm.res = {};
    vm.data = localStorageService.cookie.get('token');
    $log.debug(vm.data);

    vm.pageHeader = {
      title : 'N562D App',
      strapline: 'Have a nice flight!'
    };

    vm.verifyUser = function () {
      flightData.verifyUser(vm.data)
      .success(function (response) {
        //move to homepage
        if (response == 'true') {
          $location.url("home");
          $log.debug(response);
        }
      })
      .error(function (err) {
        console.log(err);
      });
    };

    vm.login = function (){
      flightData.tryLogin(vm.data.user, vm.data.password)
        .success(function (response) {
          //put token in local storage
          $log.debug(vm.res);
          vm.res = response;
          localStorageService.cookie.set('token', vm.res);
          vm.data = vm.res;
          vm.verifyUser();
        })
        .error(function (err) {
          console.log(err);
          vm.res = err;
          localStorageService.cookie.set('token', vm.res);
        });
    };
    if (vm.data) {
      vm.verifyUser();
    }
  }
})();
