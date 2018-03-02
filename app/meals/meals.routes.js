/***************************************
 * Meal(s) resource route defintion and logic
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

    // Meal routes definitions
    function initRoutes() {

        // GET /meals?restaurantid
        router.route('/meals').get(function (req, res) {
            var restaurantid = req.query.restaurantid;
            var name = req.query.name;
            var menuid = req.query.menuid;

            return models.Meal.readMeals(restaurantid, name, menuid).then(
                function success(result) {
                    console.log('GET successful. Responding with meals.');
                    return res.status(200).json({ meals: result });
                },
                function fail(err) {
                    console.log('GET failed with error: ' + err);
                    return res.status(500).json(null);
                }
            );

            // if it gets this far, something wrong with server logic
            return res.status(500).send('GET failed. Server logic error.');
        });

        // GET /meal?id
        router.route('/meal').get(function (req, res) {
            var id = req.query.id;

            var ret = validateGetMeal(id);
            if (ret.err) {
                console.log('GET failed. Error ' + ret.err + ': ' + ret.msg);
                return res.status(ret.err).send(ret.msg);
            }

            return models.Meal.readMeal(id).then(
                function success(result) {
                    if (!result) {
                        console.log('GET failed. Meal not found.');
                        return res.status(404).send('Meal not found.');
                    }
                    console.log('GET successful. Responding with meal.');
                    return res.status(200).json(result);
                },
                function fail(err) {
                    console.log('GET failed with error: ' + err);
                    return res.status(500).json(null);
                }
            );
        });

        // GET /search/meal?name
        router.route('/search/meal').get(function (req, res) {
            var name = req.query.name;

            var ret = validateSearchMeal(name);
            if (ret.err) {
                console.log('GET failed. Error ' + ret.err + ': ' + ret.msg);
                return res.status(ret.err).send(ret.msg);
            }

            return models.Meal.searchMeal(name).then(
                function success(result) {
                    if (!result) {
                        console.log('GET failed. Meal not found.');
                        return res.status(404).send('Meal not found.');
                    }
                    console.log('GET successful. Responding with meal.');
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

        // POST meal
        router.route('/meal').post(function (req, res) {
            var restaurantid = req.body.restaurantid;
            var name = req.body.name;
            var price = req.body.price;
            var description = req.body.description;
            var image = req.body.image;
            var menuid = req.body.menuid;

            var ret = validatePostMeal(restaurantid, name, price);
            if (ret.err) {
                console.log('POST failed. Error ' + ret.err + ': ' + ret.msg);
                return res.status(ret.err).send(ret.msg);
            }

            var restaurant;
            return models.Restaurant.readRestaurant(restaurantid)
                .then(function (result) {
                    if (!result) {
                        throw new Error('Restaurant not found');
                    }
                    return models.Meal.createMeal(restaurantid, name, price, description, menuid, image);
                })
                .then(function success(result) {
                        console.log('POST successful. Responding with new meal.');
                        return res.status(200).json(result);
                })
                .then(null, function fail(err) {
                    console.log('POST failed. ' + err.message);
                    return res.status(403).send(err.message);
                });

            // if it gets this far, something wrong with server logic
            return res.status(500).send('POST failed. Server logic error.');
        });

        // PUT meal?id
        router.route('/meal').put(function (req, res) {
            var id = req.query.id;
            var name = req.body.name;
            var price = req.body.price;
            var description = req.body.description;
            var image = req.body.image;

            var ret = {};
            ret = validatePutMeal(id);
            if (ret.err) {
                console.log('PUT failed. Error ' + ret.err + ': ' + ret.msg);
                return res.status(ret.err).send(ret.msg);
            }

            return models.Meal.updateMeal(id, name, price, description, image).then(
                function success(result) {
                    if (!result) {
                        console.log('PUT failed. Meal ID not found.');
                        return res.status(404).send('Meal not found');
                    }
                    console.log('PUT successful. Responding with updated meal.');
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

        // DELETE /meal?id&restaurantid
        router.route('/meal').delete(function (req, res) {
            var id = req.query.id;
            var restaurantid = req.query.restaurantid;

            var ret = {};
            ret = validateDeleteMeal(id);
            if (ret.err) {
                console.log('DELETE failed. Error ' + ret.err + ': ' + ret.msg);
                return res.status(ret.err).send(ret.msg);
            }

            return models.Meal.deleteMeal(id).then(
                function success(result) {
                    if (!result) {
                        console.log('DELETE failed. Meal not found.');
                        return res.status(404).send('Meal not found');
                    }
                    console.log('Meal deleted successfully.');
                    return models.Review.deleteReviews(null, result._id).then(
                        function success(result) {
                            if(!result || result.result.n == 0) {
                                console.log('No reviews to delete.');
                            } else {
                                console.log(result.result.n + ' review(s) deleted successfully.');
                            }
                            console.log('DELETE successful.');
                            return res.status(200).json(null);
                        },
                        function fail(err) {
                            console.log('DELETE reviews failed with error: ' + err);
                            return res.status(500).json(null);
                        }
                    )
                },
                function fail(error) {
                    console.log('DELETE meal failed with error: ' + err);
                    return res.status(500).json(null);
                }
            )

            // if it gets this far, something wrong with server logic
            return res.status(500).send('PUT failed. Server logic error.');
        });
    }

    /* VALIDATION LOGIC - i.e. validation done without need for DB */

   function validateSearchMeal(name) {
        if (!name) {
            return {
                err: 403,
                msg: 'Missing meal name'
            };
        };
        return {
            err: 0,
            msg: ''
        };
    }

    function validateGetMeal(id) {
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

    function validatePostMeal(restaurantid, name, price) {
        if (!restaurantid || !name || !price) {
            return {
                err: 403,
                msg: 'Missing restaurant ID, meal name, or meal price'
            };
        };
        return {
            err: 0,
            msg: ''
        };
    }

    function validatePutMeal(id) {
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

    function validateDeleteMeal(id) {
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
