/***************************************
 * Meal model definition and DB logic
 ***************************************/

(function () {

    'use strict';

    // Globals
    var Meal;
    var schemaDefn = {
        restaurantid: { type: String, required: true },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        description: { type: String, default: '' },
        menuid: { type: String, required: true },
        image: { type: String, default: ''}
    };

    // Review DB logic/config to make available
    module.exports = function () {
        return {
            getSchemaDefn: function () {
                return schemaDefn;
            },
            setModel: function (model) {
                Meal = model;
            },
            readMeal: function (id) {
                return Meal.findById(id).exec();
            },
            readMeals: function (restaurantid, name, menuid) {
                var query;

                var queryFields = [];
                if (restaurantid === 0 || restaurantid) {
                    queryFields.push({ restaurantid: restaurantid });
                }
                if (name) {
                    queryFields.push({ name: name });
                }
                if (menuid === 0 || menuid) {
                    queryFields.push({ menuid: menuid });
                }

                query = Meal.find({ $and: queryFields });
                if (!(restaurantid === 0 || restaurantid) && !name && !(menuid === 0 || menuid)) {
                    query = Meal.find();
                }
                return query.exec();
            },
            createMeal: function (restaurantid, name, price, description, menuid, image) {
                var newMeal = new Meal();
                if (restaurantid === 0 || restaurantid) newMeal.restaurantid = restaurantid;
                if (name) newMeal.name = name;
                if (price) newMeal.price = parseFloat(price).toFixed(2);
                if (description) newMeal.description = description;
                if (image) newMeal.image = image;
                if (menuid === 0 || menuid) newMeal.menuid = menuid;

                return newMeal.save();
            },
            updateMeal: function (id, name, price, description, image) {
                var updatedFields = {};
                if (name) updatedFields.name = name;
                if (price) updatedFields.price = parseFloat(price).toFixed(2);
                if (description) updatedFields.description = description;
                if (image) updatedFields.image = image;
                return Meal.findByIdAndUpdate(
                    id,
                    { $set: updatedFields },
                    { new: true }
                ).exec();
            },
            deleteMeal: function (id) {
                return Meal.findByIdAndRemove(id).exec();
            },
            deleteMeals: function (restaurantid, menuid) {
                var queryFields = [];
                if (restaurantid === 0 || restaurantid) {
                    queryFields.push({ restaurantid: restaurantid });
                }
                if (menuid === 0 || menuid) {
                    queryFields.push({ menuid: menuid });
                }

                if (!(restaurantid === 0 || restaurantid) && !(menuid === 0 || menuid)) {
                    queryFields.push({ menuid: null });
                }

                return Meal.find({ $and: queryFields }).remove().exec();
            }
        };
    };

})();
