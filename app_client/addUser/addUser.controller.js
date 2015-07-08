(function () {
  
  angular
    .module('flightApp')
    .controller('addUserCtrl', addUserCtrl);

  addUserCtrl.$inject = ['$location', '$scope', 'flightData', '$log', 'localStorageService', '$location', '$route'];
  function addUserCtrl($location, $scope, flightData, $log, localStorageService, $location, $route) {
    var vm = this;
    vm.planes = [];
    vm.pageHeader = {
      title : 'Flight Tracking App',
      strapline: 'Register now!'
    };

    vm.addPlane = function () {
      if (!vm.planes[0]) {
        $log.debug('no plane objects, skipping duplicates check.');
        vm.planes.push(vm.plane);
        vm.plane = '';
      } else {
        angular.forEach(vm.planes, function (v, i) {
          if (vm.plane == v) {
            vm.planes.splice(vm.planes.indexOf(vm.plane), 1);
            vm.plane = '';
            vm.exit = 1;
            return;
          }
        });
        if (vm.exit == 1) {
          vm.exit = 0;
          return 1;
        }
        vm.planes.push(vm.plane);
        vm.plane = '';
      }
    };

    vm.addUser = function () {
      $log.debug("Add user here");

      if (!(vm.password == vm.verifyPassword)) {
        return;
      }

      vm.userData = {
        user : vm.username,
        password : vm.password,
        token : {},
        planes: vm.planes  
      };
      
      $log.debug(vm.userData);

      flightData.addUser(vm.userData)
      .success( function (data) {
        $log.debug(data);
        $location.url("/login");
      })
      .error( function (err) {
        $log.debug(err);
      });

    };

    vm.clear = function () {
      $route.reload();
    };
  }
})()