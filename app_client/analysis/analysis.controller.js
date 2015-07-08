(function () {
  angular.module('flightApp')
    .controller('analysisCtrl', analysisCtrl);

  analysisCtrl.$inject = ['localStorageService', 'flightData']
  function analysisCtrl(localStorageService, flightData) {
    //Entry VM definitions
    var vm = this;



    //Graph initialization tasks
    var xmax = 0;
    var xmin = 0;
    var ymax = 0;
    var ymin = 0;


    vm.token = localStorageService.cookie.get('token');
    if (vm.token.plane) {
      vm.planeName = vm.token.plane;
      flightData.flightData(vm.planeName)
        .success( function (data) {
        console.log(data);

        //Set up variable graph limits
        xmax = data[data.length - 1].hobbsOut;
        xmin = data[0].hobbsOut;
        ymax = 55;
        ymin = 0;

        vm.dataGraph = data;

        vm.options = {
          axes: {
            x: {key: 'hobbsOut', min: xmin, max: xmax},
            y: {min: ymin, max: ymax}
          },
          lineMode: "linear",
          series: [
            {
              id: "id_0",
              y: "fuelHour",
              label: "Fuel/h",
              color: "#1f77b4"
            },{
              id: "oilChanges",
              y: "hoursLastOilChange",
              label: "Oil Changes",
              color: "#FF0000"
            }
          ]
        };
      })
      .error(function (e) {
        console.log(e);
      });
    }

    vm.pageHeader = {
      title: 'Flight Data Analytics',
      strapline: 'D3.js in action'
    };

    
    
    vm.logout = function () {
      localStorageService.cookie.set("token", {});
      $location.url("/login");
    };

    
  }
})()