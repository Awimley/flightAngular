(function () {
  angular
    .module('flightApp')
    .service('flightData', flightData);

  flightData.$inject = [ '$http', '$log'];
  function flightData ( $http, $log) {

    var undToZero = function(data) {
      data.hobbs_in = data.hobbs_in || 0;
      data.fuel_in = data.fuel_in || 0;
      data.fuel_purch = data.fuel_purch || 0;
      data.fuel_cost = data.fuel_cost || 0;
      data.oil_added = data.oil_added || 0;
      data.oil_dipstick = data.oil_dipstick || 0;
      data.comment = data.comment || null;
      data.oil_change = data.oil_change || 0;
      return data;
    };

    var getData = function (data) {
      return $http.get('/loglist/' + data );
    };

    var findOne = function (id) {
      if (id) { return $http.get('/findone/' + id); }
      else { return null; }
    };

    var addFlight = function (data) {
      if (data) {
        //do the heavy lifting in services! (cast undefined to 0)
        data = undToZero(data);

        //then push the full object to mongodb
        return $http.post('/logadd', data);
      } else {
        return null;
      }
    };

    var updateFlight = function(data) {
      if (data) {
        data = undToZero(data);

        return $http.put('/logupdate/' + data._id, data);
      } else {
        return null;
      }      
    };

    var deleteFlight = function(id) {
      if (id) {
        return $http.get('/logupdate/delete/' + id);
      } else {
        return null;
      }
    };

    var tryLogin = function (user, pass) {
      var data = {
        user : user,
        password : pass
      }
      var config = {
        headers : {
          'Content-type' : 'application/json'
        } 
      };

      return $http.post('/login', data, config);
    };

    var verifyUser = function (data) {
      var data = {
        user : data.user,
        token : data.token
      };
      var config = {
        headers : {
          'Content-type' : 'application/json'
        } 
      };

      return $http.post('/verifyUser', data, config);
    };

    var getUsers = function () {
      return $http.get('/allUsers');
    };

    var addPlane = function (data) {
      return $http.post('/addPlane', data);
    }

    var addUser = function (data) {
      return $http.post('/addUser', data);
    };

    var updateUser = function (data) {
      return $http.post('/updateUser', data);
    };

    return {
      flightData   : getData,
      flight       : findOne,
      addFlight    : addFlight,
      deleteFlight : deleteFlight,
      updateFlight : updateFlight,
      tryLogin     : tryLogin,
      verifyUser   : verifyUser,
      addUser      : addUser,
      getUsers     : getUsers,
      addPlane     : addPlane,
      updateUser   : updateUser
    };
  }
})();