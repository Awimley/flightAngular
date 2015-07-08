//the 'airborn API' for n562d tracking application 
var api = require('../controllers/main');

//API ROUTES
module.exports = function(app){
    //CREATE========================================================= C
    app.post('/logadd', api.addFlight);
    app.post('/addUser', api.addUser);
    //READ=========================================================== R
    app.get('/loglist/:planeName', api.getLogs);    
    app.get('/findone/:id', api.findOne);
    //UPDATE========================================================= U
    app.put('/logupdate/:id', api.updateFlight);
    //DELETE========================================================= D
    app.get('/logupdate/delete/:id', api.deleteFlight);
    //AUTHENTICATION
    app.post('/login', api.tryLogin);
    app.post('/verifyUser', api.verifyUser);
};