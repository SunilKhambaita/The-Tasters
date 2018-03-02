$(function () {

    // Globals
    var mapsAPI = 'https://www.google.com/maps/embed/v1/place?key=AIzaSyBBuG8xGK63C99XyuNSpg4yx4m9LPwHJQ0';

    // Frequently referenced elements
    var searchResults;

    // Services
    var Meal = new Meals();
    var Menu = new Menus();
    var Restaurant = new Restaurants();
    var Review = new Reviews();

    // Scroll handling - wait for user to stop scrolling before firing
    var scrollTimeout;
    $(window).scroll(function () {
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
            scrollTimeout = null;
        }
        // trigger scroll event after timeout
        scrollTimeout = setTimeout(scrollEvent, 200);
    });

    // Actions to take on scroll event
    function scrollEvent() {
        // slide search into correct position
        slideSearch();
    }

    $(document).ready(function () {
        // init frequently referenced elements
        searchResults = document.getElementById('search-results');

        // put search bar in the right place
        slideSearch();

        // food and/or location searches done with enter key
        $('#input-food').keyup(function (e) {
            if (e.keyCode == 13) {
                scrollToResults();
                doSearch($('#input-food').val(), $('#input-location').val());
            }
        });
        $('#input-location').keyup(function (e) {
            if (e.keyCode == 13) {
                scrollToResults();
                doSearch($('#input-food').val(), $('#input-location').val());
            }
        });
    });


    /* HELPERS */

    function slideSearch() {
        if (window.scrollY > 128) {
            $('#main-search').css('bottom', '-32px');
        } else {
            $('#main-search').css('bottom', '192px');
        }
    }

    // scrolls to the results part of the page
    function scrollToResults() {
        $('html, body').animate({
            scrollTop: $(".page-body").offset().top - 64
        }, 400);
    }

    // performs a search based on input query
    function doSearch(foodQuery, locationQuery) {
        var food = foodQuery;
        var place = locationQuery;

        // default values for google maps API
        if (food == '') food = 'food';
        if (place == '') place = 'Toronto';

        var searchQuery = food.replace(' ', '+') + '+near+' + place.replace(' ', '+');
        $('#google-map').attr('src', mapsAPI + '&q=' + searchQuery);

        populateResults(foodQuery, locationQuery);
    }

    // open or close the search result
    function clopenResult(e, self) {
        e.stopPropagation();
        var result = $(self).parent();
        var restaurantid = result.attr('id').replace('restaurant', '');
        var mealsList = result.children('.restaurant-meals')[0];

        if (result.attr('class') == 'search-result card expanded') {
            result.height($(self).innerHeight());
            result.attr('class', 'search-result card collapsed');
            return;
        }

        // populate meals async
        populateMealList(restaurantid).then(function () {
            result.height($(self).innerHeight() + $(mealsList).innerHeight());
            $(result).attr('class', 'search-result card expanded');
        });


    }

    // repopulates the search results based on a query
    function populateResults(food, location) {
        $(searchResults).empty();

        return Restaurant.searchRestaurants(food, location).then(function (data) {
            var restaurants = data.restaurants;
            return Promise.all($.map(restaurants, function (restaurant) {
                return Review.getRestaurantReviews(restaurant._id).then(function (data) {
                    restaurant.reviews = data.reviews;
                    return restaurant;
                });
            }));
        }).then(
            function success(result) {
                // restaurants loaded; append is async, so wait until done to init clicks
                Promise.all($.map(result, function (restaurant) {
                    return appendResult(restaurant);
                })).then(function () {
                    initResultsClickHandlers();
                });
            },
            function fail(xhr, statusText, error) {
                alert(error + ':' + statusText);
                console.log(error, statusText, xhr);
            }
        );
    }

    // repopulates restaurants meals list
    function populateMealList(restaurantid) {
        $('#meals-restaurant' + restaurantid).empty();

        return Meal.getRestaurantsMeals(restaurantid).then(function (data) {
            var meals = data.meals;
            return Promise.all($.map(meals, function(meal) {
                return Review.getMealsReviews(meal._id).then(function (data) {
                    meal.reviews = data.reviews;
                    return meal;
                });
            }));
        }).then(
            function success(result) {
                if (!result.length) {
                    $('#meals-restaurant' + restaurantid).append('<p>No meals.</p>');
                    return;
                }
                // meals with reviews loaded; do an async append
                return Promise.all($.map(result, function (meal) {
                    return appendMeal(restaurantid, meal);
                }));
            },
            function fail(xhr, statusText, error) {
                alert(error + ':' + statusText);
                console.log(error, statusText, xhr);
            }
        );
    }

    // async append a restaurant to the search results
    function appendResult(restaurant) {
        restaurant.rating = calculateRating(restaurant.reviews);
        return $.get('../../partials/search-result.ejs', function (template) {
            return $(searchResults).append(ejs.compile(template)({
                restaurant: restaurant
            }));
        });
    }

    // async append a meal to the search results
    function appendMeal(resaurantid, meal) {
        meal.rating = calculateRating(meal.reviews);
        return $.get('../../partials/menu-item.ejs', function (template) {
            return $('#meals-restaurant' + resaurantid).append(ejs.compile(template)({
                meal: meal,
                static: true
            }));
        });
    }

    // initialize click handlers for results
    function initResultsClickHandlers() {
        // click handling on results
        $('div.card-header.search-result-header').each(function () {
            $(this).click(function (e) { clopenResult(e, this) })
        });
    }

    // calculates average rating, given reviews
    function calculateRating(reviews) {
        if (!reviews.length) {
            return 0;
        }
        var rating = 0;
        for (var i = 0; i < reviews.length; i++) {
            rating += reviews[i].rating;
        }
        return Math.round(rating / reviews.length);
    }

});
