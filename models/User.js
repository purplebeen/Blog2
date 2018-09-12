var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    userName : {type : String, required : true},
    id : {type : String, required : true},
    password : {type : String, required : true}
});

module.exports.User = mongoose.model('user', userSchema);