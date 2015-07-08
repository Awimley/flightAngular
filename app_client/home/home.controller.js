(function () {
  
  angular
    .module('flightApp')
    .controller('homeCtrl', homeCtrl);

  homeCtrl.$inject = ['$modal', '$scope', 'flightData', '$log', 'localStorageService', '$location'];
  function homeCtrl ($modal, $scope, flightData, $log, localStorageService, $location) {
    var vm = this;
    vm.lastInspection = 'December 2015';
    vm.pageHeader = {
      title : 'N562D App (angular edition!)',
      strapline: ''
    };
    vm.token = localStorageService.cookie.get('token');
    if (vm.token.plane) {
      flightData.flightData(vm.planeName)
      .success(function (data) {
        vm.data = {flight : data[data.length -1]};
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
    vm.selectPlane = function () {
      vm.pageHeader.strapline = vm.planeName;

      vm.token.plane = vm.planeName;
      $log.debug(vm.token);
      localStorageService.cookie.set('token', vm.token);
      
      flightData.flightData(vm.planeName)
      .success(function (data) {
        vm.data = {flight : data[data.length -1]};
      $log.debug(vm.data.flight);
      })
      .error(function (e) {
        console.log(e);
      });
    };

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
            return {
              flt_date : date,
              hobbs_out : vm.data.flight.hobbsIn,
              fuel_out : vm.data.flight.fuelIn,
              planeName: vm.planeName
            };
          }
        }
      });
      modalInstance.result.then(function () {
        flightData.flightData()
        .success(function (data) {
          vm.data = {flights : data.reverse()};
        })
        .error(function (e) {
          $log.debug(e);
        });
      });
    };
    vm.logout = function () {
      localStorageService.cookie.set("token", {});
      $location.url("/login");
    }

      

  }
})();

