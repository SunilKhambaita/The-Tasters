/***************************************
 * Restaurant model definition and DB logic
 ***************************************/

(function () {

    'use strict';

    // Globals
    var Restaurant;
    var schemaDefn = {
        ownerid: { type: String, required: true },
        name: { type: String, required: true },
        location: { type: String, required: true },
        description: { type: String, default: '' },
        image: { type: String, default: './../public/assets/img/default-restaurant-img'}
    };

    // Review DB logic/config to make available
    module.exports = function () {
        return {
            getSchemaDefn: function () {
                return schemaDefn;
            },
            setModel: function (model) {
                Restaurant = model;
            },
            readRestaurant: function (id) {
                return Restaurant.findById(id).exec();
            },
            readRestaurants: function (ownerid, name) {
                var query;
                var queryFields = [];
                if (ownerid === 0 || ownerid) queryFields.push({ ownerid: ownerid });
                if (name) queryFields.push({ name: name });

                query = Restaurant.find({ $and: queryFields });
                if (!(ownerid === 0 || ownerid) && !name) {
                    query = Restaurant.find();

                }
                return query.exec();
            },
            createRestaurant: function (ownerid, name, location, description, image) {
                var newRestaurant = new Restaurant();
                if (ownerid === 0 || ownerid) newRestaurant.ownerid = ownerid;
                if (name) newRestaurant.name = name;
                if (location) newRestaurant.location = location;
                if (description) newRestaurant.description = description;
                if (image) newRestaurant.image = image;
                return newRestaurant.save();
            },
            updateRestaurant: function (id, name, location, description, image) {
                var updatedFields = {};
                if (name) updatedFields.name = name;
                if (location) updatedFields.location = location;
                if (description) updatedFields.description = description;
                if (image) updatedFields.image = image;
                return Restaurant.findByIdAndUpdate(
                    id,
                    { $set: updatedFields },
                    { new: true }
                ).exec();
            },
            deleteRestaurant: function (id) {
                return Restaurant.findByIdAndRemove(id).exec();
            },
            deleteRestaurants: function (ownerid) {
                var queryField = { ownerid: null };
                if (ownerid === 0 || ownerid) {
                    queryField.ownerid = ownerid;
                }
                return Restaurant.find(queryField).remove().exec();
            },
            searchRestaurant: function (name) {
                return Restaurant.find({ name:new RegExp(name, 'i') }).exec();
            }
        };
    };

})();
