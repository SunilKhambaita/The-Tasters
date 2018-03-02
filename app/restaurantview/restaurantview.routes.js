/***************************************
 * Meal display route defintion and logic
 ***************************************/

(function () {

    'use strict';

    // Globals
    var models;
    var router;

    module.exports = function (Models, Router) {
        models = Models;
        router = Router.getRouter();
        return {
            // moved down to reduce excessive indentation
            initRoutes: initRoutes
        };
    };

    function initRoutes() {

        router.route('/display/restaurant').get(function (req, res) {
            var meal;
            var id = req.query.id;
            var user;
            if (req.session) {
                user = req.session.user;
            }

            var restaurant;
            // read restaurant
            return models.Restaurant.readRestaurant(id).then(function (result) {
                restaurant = result;
                if (!restaurant) {
                    throw new Error('Restaurant not found');
                }
                return models.Meal.readMeals(restaurant._id, null, null);
            // calculate restaurant rating based on meal ratings
            }).then(function (meals) {
                restaurant.rating = 0;
                restaurant.ratings = 0;
                if (!meals.length) {
                    return models.Menu.readMenus(restaurant._id);
                }
                return Promise.all(meals.map(function (meal) {
                    return models.Review.readReviews(null, meal._id).then(function (reviews) {
                        restaurant.ratings += reviews.length;
                        return reviews.map(function(review) {
                            restaurant.rating += parseInt(review.rating, 10);
                        });
                    });
                })).then(function () {
                    restaurant.rating = Math.round(restaurant.rating / restaurant.ratings);
                    return models.Menu.readMenus(restaurant._id);
                });
            // read menus
            }).then(function (menus) {
                restaurant.menus = menus;
                return;
            // finally, either render or catch error
            }).then(function () {
                res.render('index', {
                    title: 'theTasters: ' + restaurant.name,
                    body: 'pages/restaurant/restaurant.ejs',
                    restaurant: restaurant,
                    loggedUser: user
                });
            }).then(null, function fail(err) {
                console.log('GET failed with error: ' + err);
                return res.status(400).render('index', {
                    title: 'theTasters: Not Found',
                    body: 'pages/404.ejs',
                    loggedUser: user
                });
            });
        });

    }

})();
