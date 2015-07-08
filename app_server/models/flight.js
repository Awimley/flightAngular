/**
 * Created by psloss on 12/7/2014.
 */
var mongoose = require('mongoose');

var fuelLogSchema = new mongoose.Schema({
    id: String
    , flt_date: String
    , hobbs_out: Number
    , hobbs_in: Number
    , fuel_out: {type: Number}
    , fuel_in: Number
    , fuel_purch: {type: Number, min:0, max:114}
    , fuel_cost: Number
    , oil_added: Number
    , oil_dipstick: {type: Number, min: 0, max: 12}
    , oil_change: {type: Number, min: 0, max: 1}
    , comment: String
    , planeName: String
}, {strict: false});

module.exports= mongoose.model('n562d', fuelLogSchema);
