$(function () {

    /* GLOBALS */

    var signin = {
        card: document.getElementById('signin-card'),
        switchBtn: document.getElementById('choose-signin'),
        submit: $('#signin-btn'),
        form: $('#signin-form'),
        formErrors: {
            empty: $('#signin-error-empty'),
            response: $('#signin-error-response')
        },
        email: $('#signin-email'),
        password: $('#signin-pass')
    };
    var signup = {
        card: document.getElementById('signup-card'),
        switchBtn: document.getElementById('choose-signup'),
        submit: $('#signup-btn'),
        form: $('#signup-form'),
        formErrors: {
            empty: $('#signup-error-empty'),
            matchpass: $('#signup-error-matchpass'),
            response: $('#signup-error-response')
        },
        name: $('#signup-name'),
        email: $('#signup-email'),
        location: $('#signup-location'),
        password: $('#signup-pass'),
        passwordConfirm: $('#signup-pass-confirm'),
        image: $('#signup-image')
    };


    /* CLICK HANDLING */

    // switch sign-in/up buttons
    signin.switchBtn.onclick = function () { switchCards(signup, signin); };
    signup.switchBtn.onclick = function () { switchCards(signin, signup); };

    // submit sign-in-up
    signin.submit.click(function () {login(); });
    signup.submit.click(function () {register(); });




    /* HELPERS */

    // switches visible class name from one card to the other
    function switchCards(from, to) {
        if (to.card.className == 'card visible') {
            return;
        }

        from.card.className = 'card hidden';
        from.switchBtn.className = 'btn unselected';

        to.card.className = 'card visible';
        to.switchBtn.className = 'btn selected';
    }

    // attempt to register user with provided info
    function register() {
        var err = 0;
        var name = signup.name.val();
        var email = signup.email.val();
        var location = signup.location.val();
        var password = signup.password.val();
        var passwordConfirm = signup.passwordConfirm.val();
        var image = signup.image.val();
        var type;
        if($('#input-type-owner').is(':checked')) {
            type = 'owner';
        }

        err = validateRegister(name, email, location, password, passwordConfirm);
        if (err) {
            return;
        }

        console.log(image);

        $.ajax({
            type: 'POST',
            url: '/user',
            data: {
                email: email,
                password: password,
                name: name,
                location: location,
                image: image,
                type: type
            },
            success: function (data) {
                window.location = '/';
            },
            error: function (xhr, statusText, error) {
                console.log(error + ':' + statusText + '-' + xhr.responseText);
                signup.formErrors.response.text(xhr.responseText);
                signup.formErrors.response.css('display', 'inline-block');
                return;
            }
        });

    }

    // attempt to login with provided credentials
    function login() {
        var err = 0;
        var email = signin.email.val();
        var password = signin.password.val();

        err = validateLogin(email, password);
        if (err) {
            return;
        }

        console.log(email, password);

        $.ajax({
            type: 'POST',
            url: '/user/login',
            data: {
                email: email,
                password: password
            },
            success: function (data) {
                window.location = '/';
            },
            error: function (xhr, statusText, error) {
                console.log(error + ':' + statusText + '-' + xhr.responseText);
                signin.formErrors.response.text(xhr.responseText);
                signin.formErrors.response.css('display', 'inline-block');
            }
        });
    }

    // validate registration, strictly client-sided
    function validateRegister(name, email, location, password, passwordConfirm) {
        // clear errors
        for (var error in signup.formErrors) {
            signup.formErrors[error].css('display', 'none');
            if (error == 'response') {
                signup.formErrors[error].text("");
            }
        }

        // handle certain cases
        if (name == '' || email == '' || location == '' || password == '' || passwordConfirm == '') {
            signup.formErrors.empty.css('display', 'inline-block');
            return 1;
        }
        if (password != passwordConfirm) {
            signup.formErrors.matchpass.css('display', 'inline-block');
            return 1;
        }

        return 0;
    }

    // validate login, strictly client-sided
    function validateLogin(email, password) {
        // clear errors
        for (var error in signin.formErrors) {
            signin.formErrors[error].css('display', 'none');
            if (error == 'response') {
                signin.formErrors[error].text("");
            }
        }

        if (email == '' || password == '') {
            signin.formErrors.empty.css('display', 'inline-block');
            return 1;
        }

        return 0;
    }

});
