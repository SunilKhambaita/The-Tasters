/***************************************
 *
 ***************************************/

(function () {

    'use strict';

    module.exports = function () {
        return {
            // moved down to reduce excessive indentation
            initRoutes: initRoutes
        };
    };

//    function initRoutes(router) {
//
//        // GET /users
//        router.route('/users').get(function (req, res) {
//            // TODO: necessary to be able to query users on more than id?
//            models.User.readUsers().then(
//                function success(result) {
//                    console.log('GET successful. Responding with users.');
//                    return res.status(200).json({ users: result });
//                },
//                function fail(err) {
//                    console.log('GET failed with error: ' + err);
//                    return res.status(500).json(null);
//                }
//            );
//
//            // if it gets this far, something wrong with server logic
//            return res.status(500).send('GET failed. Server logic error.');
//        });
//
//        // GET /user?id
//        router.route('/user').get(function (req, res) {
//            var id = req.query.id;
//
//            var ret = validateGetUser(id);
//            if (ret.err) {
//                console.log('GET failed. Error ' + ret.err + ': ' + ret.msg);
//                return res.status(ret.err).send(ret.msg);
//            }
//
//            models.User.readUser(id).then(
//                function success(result) {
//                    if (!result) {
//                        console.log('GET failed. User not found.');
//                        return res.status(404).send('User not found.');
//                    }
//                    console.log('GET successful. Responding with User.');
//                    return res.status(200).json(result);
//                },
//                function fail(err) {
//                    console.log('GET failed with error: ' + err);
//                    return res.status(500).json(null);
//                }
//            );
//
//            // if it gets this far, something wrong with server logic
//            return res.status(500).send('GET failed. Server logic error.');
//        });
//
//        // POST /user
//        router.route('/user').post(function (req, res) {
//            var email = req.body.email;
//            var name = req.body.name;
//            var bio = req.body.bio;
//            var location = req.body.location;
//            var type = req.body.type;
//
//            var ret = validatePostUser(email, name);
//            if (ret.err) {
//                console.log('POST failed. Error ' + ret.err + ': ' + ret.msg);
//                return res.status(ret.err).send(ret.msg);
//            }
//
//            var user;
//            models.User.postUser(email, name, bio, location, type).then(
//                function success(result) {
//                    console.log('POST successful. Responding with new user.');
//                    return res.status(200).json(result);
//                },
//                function fail(err) {
//                    console.log('POST failed with error: ' + err);
//                    return res.status(500).json(null);
//                }
//            );
//
//            // if it gets this far, something wrong with server logic
//            return res.status(500).send('POST failed. Server logic error.');
//        });
//
//        // PUT user?id
//        router.route('/user').put(function (req, res) {
//            var id = req.query.id;
//            var email = req.body.email;
//            var name = req.body.name;
//            var bio = req.body.bio;
//            var location = req.body.location;
//
//            var ret = {};
//            ret = validatePutUser(id);
//            if (ret.err) {
//                console.log('GET failed. Error ' + ret.err + ': ' + ret.msg);
//                return res.status(ret.err).send(ret.msg);
//            }
//
//            models.User.updateUser(id, email, name, bio, location, type).then(
//                function success(result) {
//                    if (!result) {
//                        console.log('PUT failed. User ID not found.');
//                        return res.status(404).send('User not found');
//                    }
//                    console.log('PUT successful. Responding with updated user.');
//                    return res.status(200).json(result);
//                },
//                function fail(err) {
//                    if (err.code && err.code == 11000) {
//                        console.log('POST failed. Email not unique.');
//                        return res.status(403).send('Email taken.');
//                    }
//                    console.log('PUT failed with error: ' + err);
//                    return res.status(500).json(null);
//                }
//            );
//
//            // if it gets this far, something wrong with server logic
//            return res.status(500).send('PUT failed. Server logic error.');
//        });
//
//        // DELETE /user?id
//        router.route('/user').delete(function (req, res) {
//            var id = req.query.id;
//
//            var ret = {};
//            ret = validateDeleteUser(id);
//            if (ret.err) {
//                console.log('DELETE failed. Error ' + ret.err + ': ' + ret.msg);
//                return res.status(ret.err).send(ret.msg);
//            }
//
//            models.User.deleteUser(id).then(
//                function success(result) {
//                    if (!result) {
//                        console.log('DELETE failed. User not found.');
//                        return res.status(404).send('User not found');
//                    }
//                    console.log('User deleted successfully.');
//                    return models.Review.deleteReviews(result._id, null).then(
//                        function success(result) {
//                            if(!result || result.result.n == 0) {
//                                console.log('No reviews to delete.');
//                            } else {
//                                console.log(result.result.n + ' review(s) deleted successfully.');
//                            }
//                            console.log('DELETE successful.');
//                            return res.status(200).json(null);
//                        },
//                        function fail(err) {
//                            console.log('Deleting reviews failed with error: ' + err);
//                            return res.status(500).json(null);
//                        }
//                    )
//                },
//                function fail(error) {
//                    console.log('DELETE user failed with error: ' + err);
//                    return res.status(500).json(null);
//                }
//            )
//
//            // if it gets this far, something wrong with server logic
//            return res.status(500).send('PUT failed. Server logic error.');
//        });
//    }
//
//    /* VALIDATION LOGIC - i.e. validation done without need for DB */
//
//    function validateGetUser(id) {
//        if (!id) {
//            return {
//                err: 403,
//                msg: 'Missing ID'
//            };
//        };
//        return {
//            err: 0,
//            msg: ''
//        };
//    }
//
//    function validatePostUser(email, name) {
//        if (!email || !name) {
//            return {
//                err: 403,
//                msg: 'Missing email or name'
//            };
//        };
//        return {
//            err: 0,
//            msg: ''
//        };
//    }
//
//    function validatePutUser(id) {
//        if (!id) {
//            return {
//                err: 403,
//                msg: 'Missing ID'
//            };
//        };
//        return {
//            err: 0,
//            msg: ''
//        };
//    }
//
//    function validateDeleteUser(id) {
//        if (!id) {
//            return {
//                err: 403,
//                msg: 'Missing ID'
//            };
//        };
//        return {
//            err: 0,
//            msg: ''
//        };
//    }
//

})();
