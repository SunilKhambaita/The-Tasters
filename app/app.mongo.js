/***************************************
 * Mongo/Mongoose setup and config.
 * Access point to DB.
 ***************************************/

(function () {

    'use strict';

    // Dependencies
    require('mongodb');
    var mongoose = require('mongoose');
    var autoIncrement = require('mongoose-auto-increment');
    mongoose.Promise = require('bluebird');


    // Globals
    var database;
    var client = mongoose;
    var plugins = {
        autoIncrement: autoIncrement
    };

    // MongoDB functionality to make available
    module.exports = function () {
        return {
            connect: function () {
                client.connect('mongodb://localhost:27017/ttdb_sample');
                return client.connection;
            },
            init: function (Models) {
                plugins.autoIncrement.initialize(client.connection);
                Models.init(); // needs to run after autoIncrement init
            },
            getClient: function () {
                return client;
            },
            getPlugins: function () {
                return plugins;
            }
        };
    };

})();
