/***************************************
 * User(s) resource routing logic
 ***************************************/

(function () {

    'use strict';

    // Imports
    var {authenticate} = require('./../middleware/authenticate.js');

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

        // GET /users
        router.route('/users').get(function (req, res) {
            // TODO: necessary to be able to query users on more than id? - check

            return models.User.readUsers(req.query).then(
                function success(users) {
                    console.log('GET successful. Responding with reviews.');
                    return res.status(200).json({users});
                },
                function fail(err) {
                    console.log('GET failed with error: ' + err);
                    return res.status(404).json(null);
                }
            );

            // if it gets this far, something wrong with server logic
            return res.status(500).send('GET failed. Server logic error.');
        });

        // GET /user?id
        router.route('/user').get(function (req, res) {
            var id = req.query.id;

            var ret = validateGetUser(id);
            if (ret.err) {
                console.log('GET failed. Error ' + ret.err + ': ' + ret.msg);
                return res.status(ret.err).send(ret.msg);
            }

            return models.User.readUser(id).then(
                function success(result) {
                    if (!result) {
                        console.log('GET failed. User not found.');
                        return res.status(404).send('User not found.');
                    }
                    console.log('GET successful. Responding with User.');
                    return res.status(200).json(result);
                },
                function fail(err) {
                    console.log('GET failed with error: ' + err);
                    return res.status(400).json(null);
                }
            );

            // if it gets this far, something wrong with server logic
            return res.status(500).send('GET failed. Server logic error.');
        });


        // GET /user/me
        router.route('/user/me').get(authenticate, function (req, res) {
            res.send(req.user);
        })


        // GET /user/logout
        router.route('/user/logout').get(function (req, res) {
            req.session.reset();
            res.redirect('/');
        })


        // POST /user
        router.route('/user').post(function (req, res) {
            var email = req.body.email;
            var password = req.body.password;
            var name = req.body.name;
            var bio = req.body.bio;
            var location = req.body.location;
            var type = req.body.type;
            var image = req.body.image;

            var ret = validatePostUser(email, name);
            if (ret.err) {
                console.log('POST failed. Error ' + ret.err + ': ' + ret.msg);
                return res.status(ret.err).send(ret.msg);
            }

            var user;
            return models.User.createUser(email, password, name, bio, location, type, image).then(
                function success(result) {
                    console.log('POST successful. Responding with new user.');
                    req.session.user = result;
                    return res.status(200).json(result);
                },
                function fail(err) {
                    if (err.code == 11000) {
                        console.log('POST failed. User exists.');
                        return res.status(403).send('Email taken');
                    }
                    console.log('POST failed with error: ' + err);
                    return res.status(400).json(err);
                }
            );

            // if it gets this far, something wrong with server logic
            return res.status(500).send('POST failed. Server logic error.');
        });

        // POST user/login
        router.route('/user/login').post(function (req, res) {
            models.User.readUser(null, req.body.email).then((user)=>{
                if (!user){
                    return res.status(400).send();
                }
                if (req.body.password == user.password) {
                    req.session.user = user;
                    return res.send(user);
                } else {
                    return res.status(400).send();
                }
            }).catch((err)=>{
                return res.status(400).send();
            });
        });

        // PUT user?id
        router.route('/user').put(function (req, res) {
            var id = req.session.user._id;
            var password = req.body.password;
            var email = req.body.email;
            var name = req.body.name;
            var bio = req.body.bio;
            var location = req.body.location;
            var image = req.body.image;

            var ret = {};
            ret = validatePutUser(id);
            if (ret.err) {
                console.log('GET failed. Error ' + ret.err + ': ' + ret.msg);
                return res.status(ret.err).send(ret.msg);
            }

            return models.User.readUser(id).then(function (user) {
                if (password != user.password) {
                    throw new Error('Wrong password');
                }
                return models.User.updateUser(id, email, password, name, bio, location, image);
            })
            .then(
                function success(result) {
                    if (!result) {
                        console.log('PUT failed. User ID not found.');
                        return res.status(404).send('User not found');
                    }
                    console.log('PUT successful. Responding with updated user.');
                    return res.status(200).json(result);
                },
                function fail(err) {
                    if (err.code && err.code == 11000) {
                        console.log('POST failed. Email not unique.');
                        return res.status(403).send('Email taken.');
                    }
                    console.log('PUT failed with error: ' + err);
                    return res.status(403).json(err.message);
                }
            );

            // if it gets this far, something wrong with server logic
            return res.status(500).send('PUT failed. Server logic error.');
        });

        // DELETE /user?id
        router.route('/user').delete(function (req, res) {
            var id;
            var password = req.body.password;
            if (req.query.id) {
                id = req.query.id;
            } else {
                id = req.session.user._id;
            }

            var ret = {};
            ret = validateDeleteUser(id);
            if (ret.err) {
                console.log('DELETE failed. Error ' + ret.err + ': ' + ret.msg);
                return res.status(ret.err).send(ret.msg);
            }

            // collect things to delete, then delete
            var user;
            var restaurants = [];
            var menus = [];
            var meals = [];
            var reviews = [];
            // collect user and restaurants
            return models.User.readUser(id).then(function (data) {
                user = data;
                if (!user) {
                    throw new Error('User not found');
                }
                if (password != user.password) {
                    throw new Error('Wrong password');
                }
                return models.Restaurant.readRestaurants(user._id, null);
            })
            // collect menus
            .then(function (data) {
                restaurants = data;
                return Promise.all(restaurants.map(function (restaurant) {
                    return models.Menu.readMenus(restaurant._id).then(function (data) {
                        menus = menus.concat(data);
                        return;
                    });
                }));
            })
            // collect meals
            .then(function () {
                return Promise.all(restaurants.map(function (restaurant) {
                    return models.Meal.readMeals(restaurant._id).then(function (data) {
                        meals = meals.concat(data);
                        return;
                    });
                }));
            })
            // collect meals' reviews
            .then(function () {
                return Promise.all(meals.map(function (meal) {
                    return models.Review.readReviews(null, meal._id).then(function (data) {
                        reviews = reviews.concat(data);
                        return;
                    });
                }));
            })
            // collect users' reviews
            .then(function () {
                return models.Review.readReviews(user._id).then(function (data) {
                    reviews = reviews.concat(data);
                });
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
                promises = promises.concat(menus.map(function (menu) {
                    return models.Menu.deleteMenu(menu._id);
                }));
                promises = promises.concat(restaurants.map(function (restaurant) {
                    return models.Restaurant.deleteRestaurant(restaurant._id);
                }));
                promises.push(models.User.deleteUser(user._id));

                return Promise.all(promises);
            })
            // responses
            .then(
                function success() {
                    console.log('DELETE successful.');
                    req.session.reset();
                    return res.status(200).send(null);
                },
                function(err) {
                    console.log(err.message);
                    return res.status(403).send(err.message);
                }
            );

            // if it gets this far, something wrong with server logic
            return res.status(500).send('PUT failed. Server logic error.');

        });
    }

    /* VALIDATION LOGIC - i.e. validation done without need for DB */

    function validateGetUser(id) {
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

    function validatePostUser(email, name) {
        if (!email || !name) {
            return {
                err: 403,
                msg: 'Missing email or name'
            };
        };
        return {
            err: 0,
            msg: ''
        };
    }

    function validatePutUser(id) {
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

    function validateDeleteUser(id) {
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
