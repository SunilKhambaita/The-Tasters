/***************************************
 * Models/schemas config&init
 * Access point for feature models.
 ***************************************/

(function () {

    'use strict';

    // Imports
    var User = require('./users/users.model.js')();
    var Auth = require('./auth/auth.model.js')();
    var Restaurant = require('./restaurants/restaurants.model.js')();
    var Meal = require('./meals/meals.model.js')();
    var Review = require('./reviews/reviews.model.js')();
    var Menu = require('./menus/menus.model.js')();

    // Globals
    var db;

    // Model data/functionality to make available
    module.exports = function (Database) {
        db = Database;
        return {
            // boilerplate code for schema setup
            init: function () {
                // User
                var userSchema = new db.getClient().Schema(User.getSchemaDefn());
                userSchema.plugin(db.getPlugins().autoIncrement.plugin, 'User');
                User.setModel(db.getClient().model('User', userSchema));
                // Auth
                var authSchema = new db.getClient().Schema(Auth.getSchemaDefn());
                userSchema.plugin(db.getPlugins().autoIncrement.plugin, 'Auth');
                Auth.setModel(db.getClient().model('Auth', authSchema));
                // Restuarant
                var restaurantSchema = new db.getClient().Schema(Restaurant.getSchemaDefn());
                restaurantSchema.plugin(db.getPlugins().autoIncrement.plugin, 'Restaurant');
                Restaurant.setModel(db.getClient().model('Restaurant', restaurantSchema));
                // Meal
                var mealSchema = new db.getClient().Schema(Meal.getSchemaDefn());
                mealSchema.plugin(db.getPlugins().autoIncrement.plugin, 'Meal');
                Meal.setModel(db.getClient().model('Meal', mealSchema));
                // Review
                var reviewSchema = new db.getClient().Schema(Review.getSchemaDefn());
                reviewSchema.plugin(db.getPlugins().autoIncrement.plugin, 'Review');
                Review.setModel(db.getClient().model('Review', reviewSchema));
                // Menu
                var menuSchema = new db.getClient().Schema(Menu.getSchemaDefn());
                menuSchema.plugin(db.getPlugins().autoIncrement.plugin, 'Menu');
                Menu.setModel(db.getClient().model('Menu', menuSchema));
            },
            // models with db logic
            User: User,
            Restaurant: Restaurant,
            Meal: Meal,
            Review: Review,
            Menu: Menu
        };
    };

})();
