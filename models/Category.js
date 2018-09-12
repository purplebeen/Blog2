var mongoose = require('mongoose');

var categorySchema = new mongoose.Schema({
    name : {type : String, required : true},
    date : {type : Date, default : Date.now}
});

module.exports.Category = mongoose.model('category', categorySchema);