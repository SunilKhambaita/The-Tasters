$(function () {

    // Globals
    var bioMax = 140;

    // Service
    var User = new Users();

    $(document).ready(function () {
        // clicks
        $('#account-del-btn').click(function (e) {
            e.stopPropagation();
            showAccountDeleteForm(this);
        });
        $('#cancel-del-btn').click(function (e) {
            e.stopPropagation();
            hideAccountDeleteForm(this);
        });
        $('#submit-btn').click(function (e) {
            e.stopPropagation();
            updateAccount(this);
        });
        $('#submit-del-btn').click(function (e) {
            e.stopPropagation();
            confirmDeleteAccountA(this);
        });
        $('#submit-del-btn-two').click(function (e) {
            e.stopPropagation();
            confirmDeleteAccountB(this);
        });
        $('#submit-del-btn-three').click(function (e) {
            e.stopPropagation();
            deleteAccount(this);
        });

        // char count on bio
        $('#bio-char-count').html(bioMax);
        $('#input-bio').keyup(function() {
            var remaining = bioMax - $('#input-bio').val().length;
            $('#bio-char-count').html(remaining);
            if (remaining <= 10) {
                $('#bio-char-count').css('color', 'rgba(255, 64, 64, 0.5)');
            } else {
                $('#bio-char-count').css('color', 'rgba(255, 255, 255, 0.5)')
            }
        });
    });



    /* Helpers */

    function showAccountDeleteForm(self) {
        $('#account-del-btn').hide();
        $('#submit-del-btn-two').hide();
        $('#submit-del-btn-three').hide();
        $('#cancel-del-btn').show();
        var openedHeight = $('#acct-del-preview').innerHeight() + $('#acct-del-main').innerHeight();
        $('#account-deletion').height(openedHeight);
    }

    function hideAccountDeleteForm(self) {
        $('#account-del-btn').show();
        $('#cancel-del-btn').hide();
        $('#submit-del-btn2').hide();
        $('#submit-del-btn3').hide();
        var closedHeight = $('#acct-del-preview').innerHeight();
        $('#account-deletion').height(closedHeight);
        $('#del-input-password').val('');
        $('#del-input-password-verify').val('');
    }

    function updateAccount(self) {
        var image = $('#input-image').val();
        var name = $('#input-name').val();
        var email = $('#input-email').val();
        var location = $('#input-location').val();
        var bio = $('#input-bio').val();
        var password = $('#input-password').val();

        User.updateUser(image, email, name, location, bio, password).then(
            function success() {
                window.location = '/display/profile';
            },
            function fail(xhr, statusText, error) {
                $('#acct-update-response').html(xhr.responseText);
            }
        );
    }

    function confirmDeleteAccountA(self) {
        var password = $('#del-input-password').val();
        var passwordVerify = $('#del-input-password-verify').val();
        $('#acct-del-response').html('');
        if (!password || !passwordVerify) {
            $('#acct-del-response').html('Invalid password');
            return;
        }
        if (password !== passwordVerify) {
            $('#acct-del-response').html('Passwords do not match');
            return;
        }
        $('#submit-del-btn-two').show();
        $('#account-deletion').height($('#account-deletion').height() + $('#submit-del-btn-two').outerHeight(true));
    }

    function confirmDeleteAccountB(self) {
        var password = $('#del-input-password').val();
        var passwordVerify = $('#del-input-password-verify').val();
        $('#acct-del-response').html('');
        if (!password || !passwordVerify) {
            $('#acct-del-response').html('Invalid password');
            return;
        }
        if (password !== passwordVerify) {
            $('#acct-del-response').html('Passwords do not match');
            return;
        }
        $('#submit-del-btn-three').show();
        $('#account-deletion').height($('#account-deletion').height() + $('#submit-del-btn-three').outerHeight(true));
    }

    function deleteAccount(self) {
        var password = $('#del-input-password').val();
        var passwordVerify = $('#del-input-password-verify').val();
        $('#acct-del-response').html('');
        if (!password || !passwordVerify) {
            $('#acct-del-response').html('Invalid password');
            return;
        }
        if (password !== passwordVerify) {
            $('#acct-del-response').html('Passwords do not match');
            return;
        }
        User.deleteUser(null, password).then(
            function success() {
                alert('Account successfully deleted.');
                window.location = '/';
            },
            function fail(xhr, statusText, error) {
                $('#acct-del-response').html(xhr.responseText);
            }
        );
    }

});
