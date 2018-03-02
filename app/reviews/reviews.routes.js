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

        // GET /reviews?userid&mealid&restaurantid
        router.route('/reviews').get(function (req, res) {
            var userid = req.query.userid;
            var mealid = req.query.mealid;
            var restaurantid = req.query.restaurantid;

            var promise;

            var reviews = [];
            // if restaurant, need to find all meals, then find all meals' reviews
            if (restaurantid) {
                promise = models.Meal.readMeals(restaurantid, null, null).then(
                    function (meals) {
                        return Promise.all(meals.map(function (meal) {
                            return models.Review.readReviews(null, meal._id).then(
                                function (result) {
                                    reviews = reviews.concat(result);
                                }
                            );
                        }));
                    }
                );
            } else {
                promise = models.Review.readReviews(userid, mealid).then(function (result) {
                    reviews = result;
                });
            }

            return promise.then(
                function success() {
                    console.log('GET successful. Responding with reviews.');
                    return res.status(200).json({ reviews: reviews });
                },
                function fail(err) {
                    console.log('GET failed with error: ' + err);
                    return res.status(500).json(null);
                }
            );

            // if it gets this far, something wrong with server logic
            return res.status(500).send('GET failed. Server logic error.');
        });

        // GET /review?id
        router.route('/review').get(function (req, res) {
            var id = req.query.id;

            var ret = validateGetReview(id);
            if (ret.err) {
                console.log('GET failed. Error ' + ret.err + ': ' + ret.msg);
                return res.status(ret.err).send(ret.msg);
            }

            return models.Review.readReview(id).then(
                function success(result) {
                    if (!result) {
                        console.log('GET failed. Review not found.');
                        return res.status(404).send('Review not found.');
                    }
                    console.log('GET successful. Responding with Review.');
                    return res.status(200).json(result);
                },
                function fail(err) {
                    console.log('GET failed with error: ' + err);
                    return res.status(500).json(null);
                }
            );

            // if it gets this far, something wrong with server logic
            return res.status(500).send('GET failed. Server logic error.');
        });

        // POST /review
        router.route('/review').post(function (req, res) {
            var userid = req.session.user._id;
            var mealid = req.body.mealid;
            var rating = req.body.rating;
            var comment = req.body.comment;

            var ret = validatePostReview(userid, mealid, rating);
            if (ret.err) {
                console.log('POST failed. Error ' + ret.err + ': ' + ret.msg);
                return res.status(ret.err).send(ret.msg);
            }

            var user;
            var meal;
            var reviews;
            return models.User.readUser(userid)
                .then(function (result) {
                    user = result;
                    return models.Meal.readMeal(mealid);
                })
                .then(function (result) {
                    meal = result;
                    return models.Review.readReviews(userid, mealid);
                })
                .then(function (result) {
                    reviews = result;
                    if (!user || !meal || reviews.length) {
                       console.log('POST failed.');
                       return res.status(403).send('Cannot create review');
                    }
                    return models.Review.createReview(userid, mealid, rating, comment).then(
                        function success(result) {
                            console.log('POST successful. Responding with new review.');
                            return res.status(200).json(result);
                        },
                        function fail(err) {
                            console.log('POST failed with error: ' + err);
                            return res.status(500).json(null);
                        }
                    );
                });

            // if it gets this far, something wrong with server logic
            return res.status(500).send('POST failed. Server logic error.');
        });

        // PUT review?id
        router.route('/review').put(function (req, res) {
            var id = req.query.id;
            var rating = req.body.rating;
            var comment = req.body.comment;

            var ret = {};
            ret = validatePutReview(id, rating);
            if (ret.err) {
                console.log('PUT failed. Error ' + ret.err + ': ' + ret.msg);
                return res.status(ret.err).send(ret.msg);
            }

            return models.Review.updateReview(id, rating, comment).then(
                function success(result) {
                    if (!result) {
                        console.log('PUT failed. Review ID not found.');
                        return res.status(404).send('Review not found');
                    }
                    console.log('PUT successful. Responding with updated review.');
                    return res.status(200).json(result);
                },
                function fail(err) {
                    console.log('PUT failed with error: ' + err);
                    return res.status(500).json(null);
                }
            );

            // if it gets this far, something wrong with server logic
            return res.status(500).send('PUT failed. Server logic error.');
        });

        // DELETE /review?id
        router.route('/review').delete(function (req, res) {
            var id = req.query.id;

            var ret = {};
            ret = validateDeleteReview(id);
            if (ret.err) {
                console.log('DELETE failed. Error ' + ret.err + ': ' + ret.msg);
                return res.status(ret.err).send(ret.msg);
            }

            return models.Review.deleteReview(id).then(
                function success(result) {
                    if (!result) {
                        console.log('DELETE failed. Review not found.');
                        return res.status(404).send('Review not found');
                    }
                    console.log('DELETE successful.');
                    return res.status(200).json(null);
                },
                function fail(error) {
                    console.log('DELETE review failed with error: ' + err);
                    return res.status(500).json(null);
                }
            )

            // if it gets this far, something wrong with server logic
            return res.status(500).send('DELETE failed. Server logic error.');
        });
    }

    /* VALIDATION LOGIC - i.e. validation done without need for DB */

    function validateGetReview(id) {
        if (!id) {
            return {
                err: 403,
                msg: 'Missing ID'
            };
        };
        return {
            err: 0,
            msg: ''
        };
    }

    function validatePostReview(userid, mealid, rating) {
        if (!userid || !mealid || !rating) {
            return {
                err: 403,
                msg: 'Missing user ID, meal ID, or rating'
            };
        };
        if (parseInt(rating, 10) > 5 || parseInt(rating, 10) < 1) {
            return {
                err: 403,
                msg: 'Invalid rating'
            };
        }
        return {
            err: 0,
            msg: ''
        };
    }

    function validatePutReview(id) {
        if (!id) {
            return {
                err: 403,
                msg: 'Missing ID'
            };
        };
        return {
            err: 0,
            msg: ''
        };
    }

    function validateDeleteReview(id) {
        if (!id) {
            return {
                err: 403,
                msg: 'Missing ID'
            };
        };
        return {
            err: 0,
            msg: ''
        };
    }

})();
