(function () {
  
  angular
    .module('flightApp')
    .controller('homeCtrl', homeCtrl);

  homeCtrl.$inject = ['$modal', '$scope', 'flightData', '$log', 'localStorageService', '$location', '$route'];
  function homeCtrl ($modal, $scope, flightData, $log, localStorageService, $location, $route) {
    var vm = this;
    vm.lastInspection = 'December 2015';
    vm.pageHeader = {
      title : 'N562D App (angular edition!)',
      strapline: ''
    };
    vm.token = localStorageService.cookie.get('token');

    if (vm.token.planes) {
      vm.planeName = vm.token.planes[0];
      flightData.flightData(vm.planeName)
      .success(function (data) {
        vm.data = {
          flight : data[data.length -1],
          flights: data.reverse()
        };
      $log.debug(vm.data.flight);
      })
      .error(function (e) {
        console.log(e);
      });
    }

    $log.debug(vm.token);

    var date = new Date();
    date = date.toISOString();
    date = date.slice(5,7) + '/' + date.slice(8,10) + '/' + date.slice(2,4);

   //API calls are cool
    vm.selectPlane = function (plane) {
      vm.pageHeader.strapline = plane;
      //set plane in header
      vm.token.plane = plane;
      vm.planeName = plane;
      $log.debug(vm.token);
      localStorageService.cookie.set('token', vm.token);

      //Import flight data for selected plane
      flightData.flightData(vm.planeName)
      .success(function (data) {
        vm.data = {flights : data.reverse()};
        console.log(data);
      })
      .error(function (e) {
        console.log(e);
      });
    };

    vm.updateUser = function () {
      var data = {
        lastInspection : vm.lastInspection,
        user: vm.token.user
      };

      flightData.updateUser(data);
    }

    //for adding flights
    vm.popupAddForm = function () {
      if (!vm.planeName) {
        alert("Please select an aircraft before attempting to add a flight.");
        return;
      }
      var modalInstance = $modal.open ({
        templateUrl : '/modals/addModal.view.html',
        controller : 'addModalCtrl as vm',
        resolve : {
          flight : function () {
            $log.debug(vm.data.flights);
            if (!vm.data.flights[0]) {
              $log.debug("we got no flights bruh");
              return {
                flt_date: date,
                hobbs_out: null,
                fuel_out: null,
                planeName: vm.planeName
              }
            } else {
              return {
                flt_date : date,
                hobbs_out : vm.data.flights[0].hobbsIn,
                fuel_out : vm.data.flights[0].fuelIn,
                planeName: vm.planeName
              };  
            }
          }
        }
      });
      modalInstance.result.then(function () {
        flightData.flightData(vm.planeName)
        .success(function (data) {
          vm.data = {
            flight : data[data.length -1],
            flights: data.reverse()
          };
        })
        .error(function (e) {
          $log.debug(e);
        });
      });
    };

    vm.addPlane = function () {
      flightData.addPlane({
        planeName: vm.plane,
        token: vm.token
      })
      .success( function (data) {
        $log.debug(data);
        vm.token.planes.push(vm.plane);
        localStorageService.cookie.set('token', vm.token);
        $route.reload();
      })
      .error (function (err) {
        $log.debug(err);
      })
    };

    vm.logout = function () {
      localStorageService.cookie.set("token", {});
      $location.url("/login");
    };
  }
})();