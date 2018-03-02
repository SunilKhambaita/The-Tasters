/***********************************************
 * Review Service for making AJAX calls
 **********************************************/

function Reviews() {

    this.getReview = function (id) {
        return $.ajax({
            type: 'GET',
            url: '/review?id=' + id
        });
    }

    this.getMealsReviews = function (mealid) {
        return $.ajax({
            type: 'GET',
            url: '/reviews?mealid=' + mealid
        });
    }

    this.getUsersReviews = function (userid) {
        return $.ajax({
            type: 'GET',
            url: '/reviews?userid=' + userid
        });
    }

    this.getRestaurantReviews = function (restaurantid) {
        return $.ajax({
            type: 'GET',
            url: '/reviews?restaurantid=' + restaurantid
        });
    }

    this.saveReview = function (userid, mealid, rating, comment) {
        return $.ajax({
            type: 'POST',
            url: '/review',
            data: {
                userid: userid,
                mealid: mealid,
                rating: rating,
                comment: comment
            }
        });
    }

    this.updateReview = function (id, rating, comment) {
        return $.ajax({
            type: 'PUT',
            url: '/review?id=' + id,
            data: {
                rating: rating,
                comment: comment
            }
        });
    }

    this.deleteReview = function (id) {
        return $.ajax({
            type: 'DELETE',
            url: '/review?id=' + id
        });
    }

}
