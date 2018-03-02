/***********************************************
 * Meal Service for making AJAX calls
 **********************************************/

function Meals() {

    this.getMeal = function (id) {
        return $.ajax({
            type: 'GET',
            url: '/meal?id=' + id
        });
    }

    this.getRestaurantsMeals = function (restaurantid) {
        return $.ajax({
            type: 'GET',
            url: '/meals?restaurantid=' + restaurantid
        });
    }

    this.getMenusMeals = function (menuid) {
        return $.ajax({
            type: 'GET',
            url: '/meals?menuid=' + menuid
        });
    }

    this.searchMeals = function (name) {
        return $.ajax({
            type: 'GET',
            url: '/meals?name=' + name
        });
    }

    this.saveMeal = function (restaurantid, menuid, name, price, description, image) {
        return $.ajax({
            type: 'POST',
            url: '/meal',
            data: {
                restaurantid: restaurantid,
                name: name,
                price: price,
                description: description,
                menuid: menuid,
                image: image
            }
        });
    }

    this.updateMeal = function (id, name, price, description, image) {
        return $.ajax({
            type: 'PUT',
            url: '/meal?id=' + id,
            data: {
                name: name,
                price: price,
                description: description,
                image: image
            }
        });
    }

    this.deleteMeal = function (id) {
        return $.ajax({
            type: 'DELETE',
            url: '/meal?id=' + id
        });
    }

}
