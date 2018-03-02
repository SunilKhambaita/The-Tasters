/***********************************************
 * User Service for making AJAX calls
 **********************************************/

function Users() {

    this.getUser = function (id) {
        return $.ajax({
            type: 'GET',
            url: '/user?id=' + id
        });
    }

    this.getUsers = function () {
        return $.ajax({
            type: 'GET',
            url: '/users'
        });
    }

    this.saveUser = function (email, name, bio, location, type, image) {
        return $.ajax({
            type: 'POST',
            url: '/user',
            data: {
                email: email,
                name: name,
                bio: bio,
                location: location,
                type: type,
                image: image
            }
        });
    }

    this.updateUser = function (image, email, name, location, bio, password) {
        return $.ajax({
            type: 'PUT',
            url: '/user',
            data: {
                image: image,
                email: email,
                name: name,
                bio: bio,
                location: location,
                password: password
            }
        });
    }

    this.deleteUser = function (id, password) {
        return $.ajax({
            type: 'DELETE',
            url: '/user',
            data: {
                password: password
            }
        });
    }

}
