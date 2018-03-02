/***********************************************
 * Menu Service for making AJAX calls
 **********************************************/

function Menus() {

    this.getMenu = function (id) {
        return $.ajax({
            type: 'GET',
            url: '/menu?id=' + id
        });
    }

    this.getRestaurantsMenus = function (restaurantid) {
        return $.ajax({
            type: 'GET',
            url: '/menus?restaurantid=' + restaurantid
        });
    }

    this.saveMenu = function (restaurantid, name) {
        return $.ajax({
            type: 'POST',
            url: '/menu',
            data: {
                restaurantid: restaurantid,
                name: name
            }
        });
    }

    this.deleteMenu = function (id) {
        return $.ajax({
            type: 'DELETE',
            url: '/menu?id=' + id
        });
    }

}
