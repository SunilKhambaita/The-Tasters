/***************************************
 * Router setup and config.
 ***************************************/

(function () {

    'use strict';

    // Globals
    var router;

    module.exports = function (express) {
        // define router
        router = express.Router();
        initViewRoutes();

        // Make router available
        return {
            getRouter: function () {
                return router;
            }
        };
    };

    function initViewRoutes() {
        // home
        router.route('/').get(function (req, res) {
            res.render('index', {
                title: 'theTasters: Home',
                body: 'pages/home/home.ejs',
                loggedUser: req.session.user
            });
        });
        // profile
        router.route('/profile').get(function (req, res) {
            res.render('index', {
                title: 'theTasters: My Profile',
                //body: 'pages/profile/profile.ejs'
                body: 'pages/404.ejs', // 404 for now, since not passing user yet
                loggedUser: req.session.user
            });
        });
        // signup
        router.route('/signup').get(function (req, res) {
            res.render('index', {
                title: 'theTasters: Register/Login',
                body: 'pages/signup/signup.ejs',
                loggedUser: req.session.user
            });
        });
        // account settings
        router.route('/settings').get(function (req, res) {
            res.render('index', {
                title: 'theTasters: Account Settings',
                body: 'pages/account-settings/account-settings.ejs',
                loggedUser: req.session.user
            });
        });
    }

})();
