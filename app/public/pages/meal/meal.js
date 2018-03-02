$(function () {

    // Globals
    var mealid = getUrlQuery()['id'];
    var ratings = new Rating(document.getElementById('user-rating'));

    // Services
    var User = new Users();
    var Meal = new Meals();
    var Restaurant = new Restaurants();
    var Review = new Reviews();


    $(document).ready(function () {
        // edit meal button
        $('#btn-edit-meal').click(function (e) {
            e.stopPropagation();
            showEditMealForm(this);
        });
        // save edit meal
        $('#save-meal').click(function (e) {
            e.stopPropagation();
            updateMeal(this);
        });

        // cancel edit meal
        $('#cancel-meal').click(function (e) {
            e.stopPropagation();
            hideEditMealForm(self);
        });
        // clicking ratings
        $('#user-rating').click(function (e) {
            e.stopPropagation();
            ratings.rate(e);
        });
        // submit review
        $('#submit-review').click(function (e) {
            e.stopPropagation();
            submitReview();
        });
    });

    /* HELPERS */

    function showEditMealForm(self) {
        $('#meal-edit-form').css('top', 0 + 'px');
    }

    function hideEditMealForm(self) {
        $('#meal-edit-form').css('top', '-300px')
        $('#edit-meal-name').val('');
        $('#edit-meal-price').val('');
        $('#edit-meal-desc').val('');
        $('#edit-meal-image').val('');
    }

    function updateMeal(self) {
        var name = $('#edit-meal-name').val();
        var price = $('#edit-meal-price').val();
        var description = $('#edit-meal-desc').val();
        var image = $('#edit-meal-iimage').val();
        Meal.updateMeal(mealid, name, price, description, image).then(
            function success(meal) {
                hideEditMealForm(self);
                $('#meal-name').html(meal.name);
                $('#meal-price').html(meal.price);
                $('#meal-desc').html(meal.description);
                $('#meal-img').attr('src', meal.image);
                $('#header-cover-img').attr('src', meal.image);
            },
            function fail(xhr, statusText, error) {
                alert(error + ':' + xhr.responseText);
            }
        );
    }

    // Takes user's review and submits it
    function submitReview() {
        var comment = $('#review-input').val()
        if (comment == '' || ratings.rating == 0) {
            return;
        }

        Review.saveReview(2, mealid, ratings.rating, comment).then(
            function success(review) {
                User.getUser(review.userid).then(function (user) {
                    review.user = user;
                    $('#no-review-txt').remove();
                    prependReview(review);
                    $('#review-input').val('');
                    ratings.reset();
                });
            },
            function fail(xhr, statusText, error) {
                console.log(error + ':' + statusText + '-' + xhr.responseText);
                alert(xhr.responseText);
            }
        );
    }

    // prepends a review using a template
    function prependReview(review) {
        $.get('../../partials/meal-review.ejs', function (template) {
            $('#reviews-list').prepend(ejs.compile(template)({ review: review }));
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
