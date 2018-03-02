/***************************************
 * User model definition and DB logic
 ***************************************/

(function () {

    'use strict';

    var mongoose = require('mongoose');
    var {Schema} = mongoose;

    // Globals
    var Auth;
    var schemaDefn = {
        user: {type: Schema.Types.ObjectId, ref:'User'},
        password: {type: String, required: true, minlength: 6},
        tokens: [{
            access:{
                type:String,
                required:true
            },
            token:{
                type:String,
                required:true
            }
        }]
    };

    // User DB logic/config to make available
    module.exports = function () {
        return {
            getSchemaDefn: function () {
                return schemaDefn;
            },
            setModel: function (model) {
                Auth = model;
            },
            readAuths: function () {
                return Auth.find().exec();
            },
            readAuth: function (id) {
                return Auth.findById(id).exec();
            },
            createAuth: function (user, password) {
                //
            },
            updateAuth: function (user, password) {
                //
            },
            deleteAuth: function (user) {
                // return User.findByIdAndRemove(id).exec();
            }
        };
    };

})();
