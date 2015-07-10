(function () {
  angular
    .module('flightApp')
    .controller('logsCtrl', logsCtrl);

  logsCtrl.$inject = ['$routeParams', '$modal', '$scope', 'flightData', '$log', 'localStorageService', '$location' ];
  function logsCtrl($routeParams, $modal, $scope, flightData, $log, localStorageService, $location) {

    var vm = this;

    //Remember the plane
    vm.token = localStorageService.cookie.get('token');
    if (vm.token.plane) {
      vm.planeName = vm.token.plane;
      flightData.flightData(vm.planeName)
      .success(function (data) {
        vm.data = {flights : data.reverse()};
        console.log(data);
      })
      .error(function (e) {
        console.log(e);
      });
    }


    //Date stuff
    var date = new Date();
    date = date.toISOString();
    date = date.slice(5,7) + '/' + date.slice(8,10) + '/' + date.slice(2,4);

    vm.pageHeader = {
      title: 'Logs'
    };

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

    vm.popupUpdateForm = function ($event) {
      var id = $event.currentTarget.attributes['id'].value;
      flightData.flight(id).success(function (data) {
        $log.debug(data);
        var modalInstance = $modal.open ({
          templateUrl : '/modals/updateModal.view.html',
          controller : 'updateModalCtrl as vm',
          resolve : {
            flight : function () {
              return {
                flight : data
              };
            }
          }
        });
        modalInstance.result.then(function (data) {
          flightData.flightData(vm.planeName)
          .success(function (data) {
            vm.data = {flights : data.reverse()};
          })
          .error(function (e) {
            $log.debug(e);
          });
        });
      })
      .error(function(err) {
        $log.debug(err);
      })
    };

    //Add form from navigation directive
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