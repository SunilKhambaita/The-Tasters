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

        router.route('/display/meal').get(function (req, res) {
            var meal;
            var id = req.query.id;
            var user;
            if (req.session) {
                user = req.session.user;
            }

            return models.Meal.readMeal(id)
                .then(function success(result) {
                    if (!result) {
                        throw new Error('Meal not found');
                    }
                    meal = result;
                    return models.Restaurant.readRestaurant(meal.restaurantid);
                })
                .then(function success(result) {
                    meal.restaurant = result;
                    meal.ownerid = result.ownerid;
                    return models.Review.readReviews(null, meal._id);
                })
                .then(function success(result) {
                    meal.rating = 0;
                    result.forEach(function (review) {
                        meal.rating += parseInt(review.rating, 10);
                    })
                    if (result.length) {
                        meal.rating = Math.round(meal.rating / result.length);
                    }

                    // map each review to readUser call, where a user is attched to each review
                    Promise.all(result.map(function (review) {
                        return models.User.readUser(review.userid).then(function (user) {
                            review.user = user;
                        });
                    // once all promises/calls resolve, continue
                    })).then(function () {
                        meal.reviews = result;
                        res.render('index', {
                            title: 'theTasters: Meal Page',
                            body: 'pages/meal/meal.ejs',
                            meal: meal,
                            loggedUser: user
                        });
                    });

                })
                .then(null, function fail(err) {
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
