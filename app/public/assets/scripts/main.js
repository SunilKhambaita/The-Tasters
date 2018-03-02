$(function () {

    $('#nav-open').click(function () {
        $('nav.side').css('left', '0');
    });

    $('#nav-close').click(function () {
        $('nav.side').css('left', '-288px');
    });

});
