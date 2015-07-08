(function () {

  angular
    .module('flightApp')
    .controller('addModalCtrl', addModalCtrl);

  addModalCtrl.$inject = ['$modalInstance', 'flight', 'flightData', '$log'];
  function addModalCtrl ($modalInstance, flight, flightData, $log) {
    var vm = this;
    vm.formError = "";
    vm.data = flight;
    console.log(flight);

    vm.onSubmit = function () {
      //Hobbs in/out, fuel out and dipstick required, also check for limits here so catching DB errors is not required.
      if (!vm.data.flt_date || !vm.data.hobbs_out || !vm.data.fuel_out || !vm.data.oil_dipstick || vm.data.oil_dipstick > 12 || vm.data.fuel_purch > 114 || vm.data.oil_change > 1 || vm.data.oil_change < 0) {
        vm.formError = "Hobbs and fuel out, Date, and Oil Dipstick (< 12 quarts) are required! (also fuel purch must be < 114, oil change 0 or 1)";
        return false;
      } else {
        vm.formError = "";

        $log.debug(vm.data);
        vm.doAdd(vm.data);
        vm.modal.close();
      }
    };

    vm.doAdd = function (data) {
      flightData.addFlight(data)
      .success(function(data) {
        vm.modal.close();
      })
      .error(function (data) {
        vm.formError = "Oops, something went wrong! Try again."
      });
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