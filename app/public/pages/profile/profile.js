$(function () {

    // Services
    var Meal = new Meals();
    var Menu = new Menus();
    var Restaurant = new Restaurants();
    var Review = new Reviews();

    $(document).ready(function () {
        $('#restaurant-add').height(59);

        // show add restaurant
        $('#restaurant-add-header').click(function (e) {
            e.stopPropagation();
            var headerHeight = $('#restaurant-add-header').innerHeight();
            var contentHeight = $('#restaurant-add-content').innerHeight();

            if ($('#restaurant-add').attr('class') == 'restaurant-add collapsed card') {
                $('#restaurant-add').height(340);
                $('#restaurant-add').attr('class', 'restaurant-add expanded card');
            } else {
                $('#restaurant-add').height(59);
                $('#restaurant-add').attr('class', 'restaurant-add collapsed card');
            }
        });

        // save restaurant
        $('#btn-save-restaurant').click(function (e) {
            e.stopPropagation();
            $('#btn-save-restaurant').prop('disabled', true);

            var name = $('#new-restaurant-name').val();
            var location = $('#new-restaurant-location').val();
            var desc = $('#new-restaurant-desc').val();
            var image = $('#new-restaurant-image').val();

            Restaurant.saveRestaurant(name, location, desc, image)
                .then(function success(result) {
                    appendRestaurant(result);
                    $('#new-restaurant-name').val('');
                    $('#new-restaurant-location').val('');
                    $('#new-restaurant-desc').val('');
                    $('#new-restaurant-image').val('');
                    $('#btn-save-restaurant').prop('disabled', false);
                },
                function fail(xhr, statusText, error) {
                    alert(statusText);
                    $('#btn-save-restaurant').prop('disabled', false);
                });
        });
    });

    // async append
    function appendRestaurant(restaurant) {
        return $.get('../../partials/restaurant-owned.ejs', function (template) {
            var newRestaurant = ejs.compile(template)({ restaurant: restaurant, static: false });
            newRestaurant = $(newRestaurant).attr('id', 'restaurant' + restaurant._id);
            newRestaurant = $(newRestaurant).css('top', '-' + ($('#restaurants-owned').innerHeight() - 46) + 'px');
            $('#restaurants-owned').append(newRestaurant);
            $('#restaurant' + restaurant._id).animate({ 'top': '0px' }, 800);
            return restaurant;
        });
    }

    // extracts the mealid from the url
    function getUrlQuery() {
        var query = {};
        var params = location.search.substring(1).split('&');
        var pos;
        for (var i = (params.length - 1); i >= 0; i--) {
            pos = params[i].indexOf('=');
            if (pos > 0) {
                key = params[i].substring(0, pos);
                val = params[i].substring(pos + 1);
                query[key] = val;
            }
        }
        return query;
    }

});
