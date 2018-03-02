/***************************************
 * Restaurant(s) resource route defintion and logic
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

        // GET /restaurants?ownerid&name
        router.route('/restaurants').get(function (req, res) {
            var ownerid = req.query.ownerid;
            var name = req.query.name;

            return models.Restaurant.readRestaurants(ownerid, name).then(
                function success(result) {
                    console.log('GET successful. Responding with restaurants.');
                    return res.status(200).json({ restaurants: result });
                },
                function fail(err) {
                    console.log('GET failed with error: ' + err);
                    return res.status(500).json(null);
                }
            );

            // if it gets this far, something wrong with server logic
            return res.status(500).send('GET failed. Server logic error.');
        });

        // GET /restaurant?id
        router.route('/restaurant').get(function (req, res) {
            var id = req.query.id;

            var ret = validateGetRestaurant(id);
            if (ret.err) {
                console.log('GET failed. Error ' + ret.err + ': ' + ret.msg);
                return res.status(ret.err).send(ret.msg);
            }

            return models.Restaurant.readRestaurant(id).then(
                function success(result) {
                    if (!result) {
                        console.log('GET failed. Restaurant not found.');
                        return res.status(404).send('Restaurant not found.');
                    }
                    console.log('GET successful. Responding with Restaurant.');
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

        // GET /search/restaurant?name
        router.route('/search/restaurant').get(function (req, res) {
            var name = req.query.name;

            var ret = validateSearchRestaurant(name);
            if (ret.err) {
                console.log('GET failed. Error ' + ret.err + ': ' + ret.msg);
                return res.status(ret.err).send(ret.msg);
            }

            return models.Restaurant.searchRestaurant(name).then(
                function success(result) {
                    if (!result) {
                        console.log('GET failed. Restaurant not found.');
                        return res.status(404).send('Restaurant not found.');
                    }
                    console.log('GET successful. Responding with Restaurant.');
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

        // POST /restaurant
        router.route('/restaurant').post(function (req, res) {
            var ownerid = req.session.user._id;
            var name = req.body.name;
            var location = req.body.location;
            var description = req.body.description;
            var image = req.body.image;

            var ret = validatePostRestaurant(ownerid, name, location);
            if (ret.err) {
                console.log('POST failed. Error ' + ret.err + ': ' + ret.msg);
                return res.status(ret.err).send(ret.msg);
            }

            return models.User.readUser(ownerid)
                // attempt to find user
                .then(function success(result) {
                    if (!result) {
                        throw new Error('Owner not found');
                    }
                    return models.Restaurant
                        .createRestaurant(ownerid, name, location, description, image);
                })
                // create restaurant
                .then(function success(result) {
                    console.log('POST successful. Responding with new restaurant.');
                    return res.status(200).json(result);
                })
                // catch any error
                .then(null, function fail(err) {
                    console.log('POST failed. ' + err.message);
                    return res.status(403).send(err.message);
                });

            // if it gets this far, something wrong with server logic
            return res.status(500).send('POST failed. Server logic error.');
        });

        // PUT restaurant?id
        router.route('/restaurant').put(function (req, res) {
            var id = req.query.id;
            var name = req.body.name;
            var location = req.body.location;
            var description = req.body.description;
            var image = req.body.image;

            var ret = {};
            ret = validatePutRestaurant(id);
            if (ret.err) {
                console.log('PUT failed. Error ' + ret.err + ': ' + ret.msg);
                return res.status(ret.err).send(ret.msg);
            }

            return models.Restaurant.updateRestaurant(id, name, location, description, image).then(
                function success(result) {
                    if (!result) {
                        console.log('PUT failed. Restaurant ID not found.');
                        return res.status(404).send('Restaurant not found');
                    }
                    console.log('PUT successful. Responding with updated restaurant.');
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

        // DELETE /restaurant?id
        router.route('/restaurant').delete(function (req, res) {
            var id = req.query.id;

            var ret = {};
            ret = validateDeleteRestaurant(id);
            if (ret.err) {
                console.log('DELETE failed. Error ' + ret.err + ': ' + ret.msg);
                return res.status(ret.err).send(ret.msg);
            }

            return models.Restaurant.deleteRestaurant(id).then(
                function success(result) {
                    if (!result) {
                        console.log('DELETE failed. Restaurant not found.');
                        return res.status(404).send('Restaurant not found');
                    }
                    console.log('Restaurant deleted successfully.');
                    return models.Meal.deleteMeal(null, result._id).then(
                        function success(result) {
                            if(!result || result.result.n == 0) {
                                console.log('No meals to delete.');
                            } else {
                                console.log(result.result.n + ' meal(s) deleted successfully.');
                            }
                            console.log('DELETE successful.');
                            return res.status(200).json(null);
                        },
                        function fail(err) {
                            console.log('DELETE meals failed with error: ' + err);
                            return res.status(500).json(null);
                        }
                    )
                },
                function fail(error) {
                    console.log('DELETE restaurant failed with error: ' + err);
                    return res.status(500).json(null);
                }
            )

            // if it gets this far, something wrong with server logic
            return res.status(500).send('PUT failed. Server logic error.');
        });
    }

    /* VALIDATION LOGIC - i.e. validation done without need for DB */

    function validateSearchRestaurant(name) {
        if (!name) {
            return {
                err: 403,
                msg: 'Missing Restaurant name'
            };
        };
        return {
            err: 0,
            msg: ''
        };
    }

    function validateGetRestaurant(id) {
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

    function validatePostRestaurant(ownerid, name, location) {
        if (!ownerid || !name || !location) {
            return {
                err: 403,
                msg: 'Missing owner ID, restaurant name, or location'
            };
        };
        return {
            err: 0,
            msg: ''
        };
    }

    function validatePutRestaurant(id) {
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

    function validateDeleteRestaurant(id) {
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
