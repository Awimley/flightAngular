(function () {

  angular
    .module('flightApp')
    .controller('updateModalCtrl', updateModalCtrl);

  updateModalCtrl.$inject = ['$modalInstance', 'flight', 'flightData', '$log'];
  function updateModalCtrl ($modalInstance, flight, flightData, $log) {
    var vm = this;
    vm.formError = "";
    vm.data = flight.flight;

    vm.onSubmit = function () {
      if (!vm.data.flt_date || !vm.data.hobbs_out || !vm.data.fuel_out || !vm.data.oil_dipstick || vm.data.oil_dipstick > 12 || vm.data.fuel_purch > 114 || vm.data.oil_change > 1 || vm.data.oil_change < 0) {
        vm.formError = "Hobbs and fuel out, Date, and Oil Dipstick (< 12 quarts) are required! (also fuel purch must be < 114, oil change 0 or 1)";
        return false;
      } else {
        //magic happens here
        flightData.updateFlight(vm.data);

        vm.formError = "";
        $log.debug(vm.data);
        $modalInstance.close();
      }
    };

    vm.deleteFlight = function () {
      flightData.deleteFlight(vm.data._id);
      $modalInstance.close();
    };

    vm.modal = {
      close : function (result) {
        $modalInstance.close(result);
      },
      cancel : function () {
        $modalInstance.dismiss('cancel');
      }
    };
  }
})();