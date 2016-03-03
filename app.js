var express = require('express');
var http = require('http');
var path = require('path');
var UglifyJS = require('uglify-js');
var fs = require('fs');
var app = express();
var expressJwt = require('express-jwt');
var jwt = require('jsonwebtoken');

// all environments
app.set('port', process.env.PORT || 80);
app.set('views', path.join(__dirname, '/app_server/views'));
app.set('view engine', 'jade');

//time to MINIFY!
var appClientFiles = [
  'app_client/app.js',
  //Controllers
  'app_client/home/home.controller.js',
  'app_client/logs/logs.controller.js',
  'app_client/modals/updateModalCtrl.js',
  'app_client/modals/addModalCtrl.js',
  'app_client/login/loginCtrl.js',
  'app_client/analysis/analysis.controller.js',
  'app_client/addUser/addUser.controller.js',
  //Services
  'app_client/common/services/flightData.service.js', 
  //Filters
  'app_client/common/filters/formatDistance.filter.js',
  'app_client/common/filters/addHtmlLineBreaks.filter.js',
  //Directives
  'app_client/common/directives/navigation/navigation.directive.js',
  'app_client/common/directives/footerGeneric/footerGeneric.directive.js',
  'app_client/common/directives/pageHeader/pageHeader.directive.js',
  'app_client/common/directives/barChart/barChart.js',
  //External modules
  'app_client/lib/angular-local-storage.js',
  'app_client/analysis/d3.js'
];

//MINIFY scripts.
var uglified = UglifyJS.minify(appClientFiles, { compress : false });

fs.writeFile('public/angular/n562d.min.js', uglified.code, function (err){
  if(err) { 
    console.log(err); 
  } else { 
    console.log('Script generated and saved: n562d.min.js'); 
  } 
});

app.use(express.favicon());
app.use(express.logger('dev'));
//app.use('/', expressJwt({ secret : 'secret' }));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
// app.use(express.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'app_client')));
app.use(function(req,res){
    res.sendfile(path.join(__dirname, 'app_client', 'index.html'))
});

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

//require('./routes')(app);
require('./app_api/routes')(app);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});