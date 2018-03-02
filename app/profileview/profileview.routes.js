/***************************************
 * Review(s) resource route defintion and logic
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

        router.route('/display/profile').get(function (req, res) {
            var user;
            var id;
            var loggedUser;

            if (req.session && req.session.user) {
                id = req.session.user._id;
                loggedUser = req.session.user;
            }
            if (req.query.id) {
              id = req.query.id;
            }
            models.User.readUser(id)
                .then(function success(result) {
                    if (!result) {
                        throw new Error('User not found');
                    }
                    user = result;
                    return models.Restaurant.readRestaurants(user._id, null);
                })
                .then(function success(restaurants) {
                    user.restaurants = restaurants;
                    return models.Review.readReviews(user._id, null);
                })
                .then(function success(result) {
                    user.mealReviews = result.length;
                    // map each review to readMeal call, where a meal is attched to each review
                    Promise.all(result.map(function (review) {
                        return models.Meal.readMeal(review.mealid)
                            .then(function (meal) {
                                review.meal = meal;
                                review.meal.rating = review.rating; //temp untils visits
                                review.meal.comment = review.comment; //temp untils visits
                                review.niceDate = getNiceDate(review.date);
                                return models.Restaurant.readRestaurant(meal.restaurantid);
                            })
                            .then(function (restaurant) {
                                review.restaurant = restaurant;
                            });
                    // once all promises/calls resolve, continue
                    })).then(function () {
                        user.niceJoined = getNiceDate(user.joined);
                        user.reviews = result;
                        res.render('index', {
                            title: 'theTasters: Profile Page',
                            body: 'pages/profile/profile.ejs',
                            user: user,
                            loggedUser: loggedUser
                        });
                    });
                })
                .then(null, function fail(err) {
                    console.log('GET failed with error: ' + err);
                    return res.status(400).render('index', {
                        title: 'theTasters: Not Found',
                        body: 'pages/404.ejs',
                        loggedUser: loggedUser
                    });
                });
        });
    }

    function getNiceDate(date) {
        var monthNames = [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December"
        ];
        var d = new Date(date);
        var month = monthNames[d.getMonth()];
        var year = d.getUTCFullYear();
        var day = d.getUTCDate();

        return month + ' ' + day + ', ' + year;
    }

})();
