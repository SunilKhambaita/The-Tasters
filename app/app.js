/***************************************
 * Main app config.
 * Server entry point.
 ***************************************/

(function () {

    'use strict';

    // App dependencies
    var express = require('express');
    var session = require('client-sessions');
    var bodyParser = require('body-parser');
    var validator = require('validator');
    var jwt = require('jsonwebtoken');
    var secret = 'team25tasters';

    // Imports
    var Database = require('./app.mongo.js')();
    var Models = require('./app.models.js')(Database);
    var Router = require('./app.router.js')(express);
    var Users = require('./users/users.routes.js')(Models, Router);
    var Meals = require('./meals/meals.routes.js')(Models, Router);
    var Menus = require('./menus/menus.routes.js')(Models, Router);
    var Restaurants = require('./restaurants/restaurants.routes.js')(Models, Router);
    var Reviews = require('./reviews/reviews.routes.js')(Models, Router);
    var MealView = require('./mealview/mealview.routes.js')(Models, Router);
    var RestaurantView = require('./restaurantview/restaurantview.routes.js')(Models, Router);
    var ProfileView = require('./profileview/profileview.routes.js')(Models, Router);

    // Define app as express app
    var app = express();

    // Locations
    app.use(express.static(__dirname + '/public'));
    app.use(express.static(__dirname + '/../node_modules'));

    // Sessions
    app.use(session({
        cookieName: 'session',
        secret: 'team25tasters',
        duration: 30 * 60 * 1000,
        activeDuration: 5 * 60 * 1000,
        httpOnly: true,
        secure: true,
        ephemeral: true
    }));

    // Middleware for refreshing sessions
    app.use(function(req, res, next) {
        if (req.session && req.session.user) {
            Models.User.readUser(null, req.session.user.email).then((user)=>{
                if (user) {
                    req.user = user;
                    delete req.user.password; // delete the password from the session
                    req.session.user = user;  //refresh the session value
                    res.locals.user = user;
                } else {
                    req.user = null;
                    req.session.user = null;
                    res.locals.user = null;
                }
                // finishing processing the middleware and run the route
                next();
            });
        } else {
            req.user = null;
            req.session.user = null;
            res.locals.user = null;
            next();
        }
    });

    // JSON/URL parsing
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
        extended: true
    }));

    // View render engine
    app.set('view engine', 'ejs');
    app.set('views', __dirname + '/public');

    // Routes and router
    Users.initRoutes();
    Meals.initRoutes();
    Menus.initRoutes();
    Restaurants.initRoutes();
    Reviews.initRoutes();
    MealView.initRoutes();
    RestaurantView.initRoutes();
    ProfileView.initRoutes();
    app.use('/', Router.getRouter());

    /* MAIN */

    // Connect to DB and listen for requests
    Database.connect()
        .on('error', function (err) {
            console.log('Error: ' + err);
            process.exit();
        })
        .once('open', function () {
            Database.init(Models); // init models on successful connect
            app.listen(3000, function () {
                console.log('Listening on port 3000...');
            })
        });

})();
