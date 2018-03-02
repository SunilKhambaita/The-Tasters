/***************************************
 * Menu(s) resource route defintion and logic
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

        // GET /menus?restaurantid
        router.route('/menus').get(function (req, res) {
            var restaurantid = req.query.restaurantid;

            return models.Menu.readMenus(restaurantid).then(
                function success(result) {
                    console.log('GET successful. Responding with menus.');
                    return res.status(200).json({ menus: result });
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
        router.route('/menu').get(function (req, res) {
            var id = req.query.id;

            var ret = validateGetMenu(id);
            if (ret.err) {
                console.log('GET failed. Error ' + ret.err + ': ' + ret.msg);
                return res.status(ret.err).send(ret.msg);
            }

            return models.Menu.readMenu(id).then(
                function success(result) {
                    if (!result) {
                        console.log('GET failed. Menu not found.');
                        return res.status(404).send('Menu not found.');
                    }
                    console.log('GET successful. Responding with menu.');
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

        // POST menu
        router.route('/menu').post(function (req, res) {
            var restaurantid = req.body.restaurantid;
            var name = req.body.name;

            var ret = validatePostMenu(restaurantid, name);
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
                    return models.Menu.createMenu(restaurantid, name);
                })
                .then(function success(result) {
                        console.log('POST successful. Responding with new menu.');
                        return res.status(200).json(result);
                })
                .then(null, function fail(err) {
                    console.log('POST failed. ' + err.message);
                    return res.status(403).send(err.message);
                });

            // if it gets this far, something wrong with server logic
            return res.status(500).send('POST failed. Server logic error.');
        });

        // DELETE /menu?id
        router.route('/menu').delete(function (req, res) {
            var id = req.query.id;

            var ret = {};
            ret = validateDeleteMenu(id);
            if (ret.err) {
                console.log('DELETE failed. Error ' + ret.err + ': ' + ret.msg);
                return res.status(ret.err).send(ret.msg);
            }

            // collect everything for deletion
            var menu;
            var meals = [];
            var reviews = [];
            // get menu and meals
            return models.Menu.readMenu(id).then(function (data) {
                menu = data;
                if (!menu) {
                    throw new Error('Menu not found');
                }
                return models.Meal.readMeals(null, null, menu._id)

            })
            // collect meals' reviews
            .then(function (data) {
                meals = data;
                return Promise.all(meals.map(function (meal) {
                    return models.Review.readReviews(null, meal._id).then(function (data) {
                        return reviews = reviews.concat(data);
                    });
                }));
            })
            // delete everything
            .then(function () {
                var promises = [];
                promises = promises.concat(reviews.map(function (review) {
                    return models.Review.deleteReview(review._id);
                }));
                promises = promises.concat(meals.map(function (meal) {
                    return models.Meal.deleteMeal(meal._id);
                }));
                promises.push(models.Menu.deleteMenu(menu._id));

                return Promise.all(promises);
            })
            // response
            .then(function () {
                console.log('DELETE successful.');
                return res.status(200).json(null);
            })
            // catch errors
            .then(null, function (err) {
                console.log('DELETE failed. ' + err.message);
                return res.status(404).send(err.message);
            });

            /*return models.Menu.deleteMenu(id).then(
                function success(result) {
                    if (!result) {
                        console.log('DELETE failed. Menu not found.');
                        return res.status(404).send('Menu not found');
                    }
                    console.log('Meal deleted successfully.');
                    return models.Meal.deleteMeals(null, result._id).then(
                        function success(result) {
                            if(!result || result.result.n == 0) {
                                console.log('No meals to delete.');
                            } else {
                                console.log(result.result.n + ' meals(s) deleted successfully.');
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
            )*/

            // if it gets this far, something wrong with server logic
            return res.status(500).send('PUT failed. Server logic error.');
        });
    }


    /* VALIDATION LOGIC - i.e. validation done without need for DB */

    function validateGetMenu(id) {
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

    function validatePostMenu(restaurantid, name) {
        if (!restaurantid || !name) {
            return {
                err: 403,
                msg: 'Missing restaurant ID or menu name'
            };
        };
        return {
            err: 0,
            msg: ''
        };
    }

    function validatePutMenu(id) {
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

    function validateDeleteMenu(id) {
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
