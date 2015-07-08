var mongoose = require('mongoose');
var dbURI = 'mongodb://psloss:lowsec15@ds051750.mongolab.com:51750/planedata';
var Flight = require('./flight');

var fuelPerHour=[],
    fltHours=[],
    fuelUsed=[];

// the data contained in docs is a cursor which must be iterated to uncover the array.
var result = Flight.find({}, function (err, docs) {     
        console.log('fuellog has ' + docs.length + ' records.\nFrom:   ' + docs[0].flt_date.substr(0, 10) + '\nThrough: ' + docs[docs.length - 1].flt_date.substr(0, 10));
    }); //easy method for cursor conversion

//CLASSIC MONGO STUFF------------------------------------------------------------------------------------------------
mongoose.connect(dbURI);
mongoose.connection.on('connected', function(){
    console.log('Mongoose connected to ' + dbURI);
});
mongoose.connection.on('error', function(err){
    console.log('Mongoose connection error: ' + err);
});
// When the connection is disconnected
mongoose.connection.on('disconnected', function () {
    console.log('Mongoose default connection disconnected.');
});

// If the Node process ends, close the Mongoose connection
process.on('SIGINT', function() {
    mongoose.connection.close(function () {
        console.log('Mongoose default connection disconnected through app termination');
        process.exit(0);
    });
});