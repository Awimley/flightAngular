(function () {
  angular
    .module('flightApp')
    .controller('logsCtrl', logsCtrl);

  logsCtrl.$inject = ['$routeParams', '$modal', '$scope', 'flightData', '$log', 'localStorageService', '$location' ];
  function logsCtrl($routeParams, $modal, $scope, flightData, $log, localStorageService, $location) {

    var vm = this;
    vm.token = localStorageService.cookie.get('token');
    $log.debug(vm.token.planes);

    //Date stuff
    var date = new Date();
    date = date.toISOString();
    date = date.slice(5,7) + '/' + date.slice(8,10) + '/' + date.slice(2,4);

    vm.pageHeader = {
      title: 'Logs'
    };

    vm.selectPlane = function () {
      vm.pageHeader.strapline = vm.planeName;
      flightData.flightData(vm.planeName)
      .success(function (data) {
        vm.data = {flights : data.reverse()};
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
          flightData.flightData()
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
            return {
              flt_date : date,
              hobbs_out : vm.data.flights[0].hobbsIn,
              fuel_out : vm.data.flights[0].fuelIn,
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