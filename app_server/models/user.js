var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    user : String,
    password : String,
    token : Object,
    planes: Array,
    lastInspection: String
});

module.exports= mongoose.model('user', userSchema);