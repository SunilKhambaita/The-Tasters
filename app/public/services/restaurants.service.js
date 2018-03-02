/***********************************************
 * Restaurant Service for making AJAX calls
 **********************************************/

function Restaurants() {

    this.getRestaurant = function (id) {
        return $.ajax({
            type: 'GET',
            url: '/restaurant?id=' + id
        });
    }

    this.getRestaurants = function () {
        return $.ajax({
            type: 'GET',
            url: '/restaurants'
        });
    }

    this.getOwnersRestaurants = function (ownerid) {
        return $.ajax({
            type: 'GET',
            url: '/restaurants?ownerid=' + restaurantid
        });
    }

    this.searchRestaurants = function (food, location) {
        var query = '';
        if (food) query += '&food=' + food;
        if (location) query += '&location' + location
        return $.ajax({
            type: 'GET',
            url: '/restaurants?' + query
        });
    }

    this.saveRestaurant = function (name, location, description, image) {
        return $.ajax({
            type: 'POST',
            url: '/restaurant',
            data: {
                name: name,
                location: location,
                description: description,
                image: image
            }
        });
    }

    this.updateRestaurant = function (id, name, location, description, image) {
        return $.ajax({
            type: 'PUT',
            url: '/restaurant?id=' + id,
            data: {
                name: name,
                location: location,
                description: description,
                image: image
            }
        });
    }

    this.deleteRestaurant = function (id) {
        return $.ajax({
            type: 'DELETE',
            url: '/restaurant?id=' + id
        });
    }

}
