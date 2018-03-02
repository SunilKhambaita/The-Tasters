$(function () {

    // Globals
    var restaurantid = getUrlQuery()['id'];

    // Services
    var Meal = new Meals();
    var Menu = new Menus();
    var Restaurant = new Restaurants();
    var Review = new Reviews();

    $(document).ready(function () {
        // init menu opening/closing
        initMenuClicks();

        // save menu button
        $('#save-new-menu').click(function (e) {
            e.stopPropagation();
            saveMenu(this);
        });

        // edit restaurant button
        $('#btn-edit-restaurant').click(function (e) {
            e.stopPropagation();
            showEditRestaurantForm(this);
        });

        // save edit restaurant
        $('#save-restaurant').click(function (e) {
            e.stopPropagation();
            updateRestaurant(this);
        });

        // cancel edit restaurant
        $('#cancel-restaurant').click(function (e) {
            e.stopPropagation();
            hideEditRestaurantForm(this);
        });

        // add meal btn
        $("button[id^='btn-add-meal-menu']").each(function () {
            $(this).click(function (e) {
                e.stopPropagation();
                showMealForm(this);
            });
        });

        // del menu btn
        $("button[id^='btn-del-menu']").each(function () {
            $(this).click(function (e) {
                e.stopPropagation();
                deleteMenu(this);
            });
        });

        // save meal btn
        $("button[id^='btn-save-meal-menu']").each(function () {
            $(this).click(function (e) {
                e.stopPropagation();
                saveMeal(this);
            });
        });
        // cancel meal btn
        $("button[id^='btn-cancel-meal-menu']").each(function () {
            $(this).click(function (e) {
                e.stopPropagation();
                hideMealForm(this);
            });
        });

        // del meal btn
        $("button[id^='btn-del-meal']").each(function () {
            $(this).click(function (e) {
                e.stopPropagation();
                deleteMeal(this);
            });
        });
    });

    var menus = document.getElementsByClassName('restaurant-menu');

    // initialize food menus
    for (i = 0; i < menus.length; i++) {
        $(menus[i]).children('div.card-header').children('div.btn-group').children('button.btn.primary').click(function (e) {
            e.stopPropagation();
            var menuid = this.id.replace('btn-add-meal-menu', '');
            $('#add-meal-form' + menuid).css("top", "24px");
        });
        menus[i].style.height = ($(menus[i].getElementsByClassName('card-header')[0]).height() + 40) + 'px';
    };


    /* HELPERS */

    function initMenuClicks() {
        $('.card-header').each(function () {
            $(this).click(function (e) {
                e.stopPropagation();
                clopenMenu(this);
            });
        });
    }

    function initNewMenu(menu) {
        // opening/closing
        $($('#menu' + menu._id).children('.card-header')[0]).click(function (e) {
            e.stopPropagation();
            clopenMenu(this);
        });

        // add meal btn
        $('#btn-add-meal-menu' + menu._id).click(function (e) {
            e.stopPropagation();
            showMealForm(this);
        });

        // del menu btn
        $('#btn-del-menu' + menu._id).click(function (e) {
            e.stopPropagation();
            deleteMenu(this);
        });

        // save meal btn
        $('#btn-save-meal-menu' + menu._id).click(function (e) {
            e.stopPropagation();
            saveMeal(this);
        });

        // cancel meal btn
        $('#btn-cancel-meal-menu' + menu._id).click(function (e) {
            e.stopPropagation();
            hideMealForm(this);
        });
    }

    function initNewMeal(meal) {
        // del meal btn
        $("#btn-del-meal" + meal._id).click(function (e) {
            e.stopPropagation();
            deleteMeal(this, meal.menuid);
        });
    }

    /*
     * calculates needed height, then changes heights and classes of restaurant-menu
     * to facilitate animation transitions
     */
    function clopenMenu(header) {
        var menu = header.parentElement;
        var content = $(menu).children('.card-content')[0];
        var menuid = header.id.replace('header-menu', '');

        // change height and class
        if (menu.className == "restaurant-menu expanded card") {
            menu.className = "restaurant-menu collapsed card";
            menu.style.height = $(header).innerHeight() + 'px';
        } else {
            if (header.parentElement.id != 'add-menu') {
                // get meals
                populateMeals(menuid).then(function () {
                    menu.className = "restaurant-menu expanded card";
                    menu.style.height = ($(header).innerHeight() + $(content).innerHeight() + 'px');
                });
            } else {
                menu.className = "restaurant-menu expanded card";
                menu.style.height = ($(header).innerHeight() + $(content).innerHeight() + 'px');
            }
        }
    }

    // async populate menu
    function populateMeals(menuid) {
        $('#meals-list-menu' + menuid).empty();
        $('#no-meals-menu' + menuid).remove();

        return Meal.getMenusMeals(menuid).then(function (data) {
            if (!data.meals.length) {
                $('#content-menu' + menuid).append('<p id="no-meals-menu' + menuid + '">No meals</p>');
            }
            var meals = data.meals;
            return Promise.all($.map(meals, function (meal) {
                return Review.getMealsReviews(meal._id).then(function (data) {
                    meal.reviews = data.reviews;
                    return appendMeal(menuid, meal);
                }).then(function () {
                    return initNewMeal(meal);
                });
            }));
        });
    }

    // saves menu and updates view
    function saveMenu(self) {
        var name = $('#new-menu-name').val();

        Menu.saveMenu(restaurantid, name).then(
            function success(result) {
                appendMenu(result);
                $('#new-menu-name').val('');
            },
            function fail(xhr, statusText, error) {
                alert(error + ':' + xhr.responseText);
            }
        );
    }

    // async append menu to menus list
    function appendMenu(menu) {
        return $.get('../../partials/restaurant-menu.ejs', function (template) {
            var newMenu = ejs.compile(template)({ menu: menu });
            newMenu = $(newMenu).css('top', '-' + ($('#restaurant-menus').innerHeight() - 128) + 'px');
            $('#restaurant-menus').append(newMenu);
            $(newMenu).animate({ 'top': '0px' }, 500, function () {});
            initNewMenu(menu);
        });
    }

    // deletes menu and updates view
    function deleteMenu(self) {
        var menuid = self.id.replace('btn-del-menu', '');

        Menu.deleteMenu(menuid).then(
            function success(result) {
                // close the card, remove contents, and animate off screen
                $("#menu" + menuid)
                    .on("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd",
                        function(e){
                            $('#menu' + menuid).children('.card-content')[0].remove();
                            $('#menu' + menuid).animate({ 'left': 300000}, 500, function () {
                                $(this).remove();
                            });
                        });
                $('#menu' + menuid).css('height', '60px');
            },
            function fail(xhr, statusText, error) {
                console.log(xhr, error, statusText);
                alert(error + ':' + xhr.responseText);
            }
        );
    }

    // shows edit restaurant form
    function showEditRestaurantForm(self) {
        $('#restaurant-edit-form').css('top', 0 + 'px');
    }

    // updates restaurant and updates view
    function updateRestaurant(self) {
        var name = $('#edit-restaurant-name').val();
        var location = $('#edit-restaurant-location').val();
        var desc = $('#edit-restaurant-desc').val();
        var image = $('#edit-restaurant-image').val();

        Restaurant.updateRestaurant(restaurantid, name, location, desc, image)
            .then(function success(result) {
                $('#restaurant-edit-form').css('top', '-300px');
                $('#restaurant-name').html(result.name);
                $('#restaurant-location').html(result.location);
                $('#restaurant-desc').html(result.description);
                if (result.image) {
                    $('#restaurant-cover-img').attr('src', result.image);
                    $('#restaurant-image').attr('src', result.image);
                } else {
                    $('#restaurant-cover-img').attr('src',
                                                '/assets/img/default-restaurant-img.png');
                    $('#restaurant-image').attr('src',
                                                '/assets/img/default-restaurant-img.png');
                }
            },
            function fail(xhr, statusText, error) {
                alert(error + ':' + xhr.responseText);
            });
    }

    // hides edit restaurant form
    function hideEditRestaurantForm(self) {
        $('#restaurant-edit-form').css('top', '-300px');
        $('#edit-restaurant-name').val('');
        $('#edit-restaurant-location').val('');
        $('#edit-restaurant-desc').val('');
        $('#edit-restaurant-image').val('');
    }

    // shows new meal form
    function showMealForm(self) {
        var menu = $(self).parent().parent().parent();
        var menuid = self.id.replace('btn-add-meal-menu', '');
        if (menu.height() < 324) {
            menu.height(324);
        }
        $('#add-meal-form' + menuid).css("top", "24px");
    }

    // hides new meal form
    function hideMealForm(self) {
        var menuid = self.id.replace('btn-cancel-meal-menu', '');
        var content = $(self).parent().parent().parent();
        var menu = content.parent();
        var header = $(menu.children('.card-header')[0]);

        menu.height(header.height() + content.height() + 80);
        $('#add-meal-form' + menuid).css("top", "24px");

        $('#add-meal-form' + menuid).css("top", "-412px");
        $('#new-meal-name-menu' + menuid).val('');
        $('#new-meal-price-menu' + menuid).val('');
        $('#new-meal-desc-menu' + menuid).val('');
        $('#new-meal-image-menu' + menuid).val('');
    }

    // saves new meal and updates view
    function saveMeal(self) {
        var menuid = self.id.replace('btn-save-meal-menu', '');
        var name = $('#new-meal-name-menu' + menuid).val();
        var price = $('#new-meal-price-menu' + menuid).val();
        var desc = $('#new-meal-desc-menu' + menuid).val();
        var image = $('#new-meal-image-menu' + menuid).val();

        Meal.saveMeal(restaurantid, menuid, name, price, desc, image).then(
            function success(result) {
                result.reviews = [];
                appendMeal(menuid, result).then(function (meal) {
                    var contentHeight = $('#content-menu' + menuid).innerHeight();
                    var headerHeight = $('#header-menu' + menuid).innerHeight();
                    if (contentHeight + headerHeight > 324) {
                        $('#menu' + menuid).height(contentHeight + headerHeight);
                    }
                    initNewMeal(meal);
                });
                $('#new-meal-name-menu' + menuid).val('');
                $('#new-meal-price-menu' + menuid).val('');
                $('#new-meal-desc-menu' + menuid).val('');
                $('#new-meal-image-menu' + menuid).val('');
            }, function fail(xhr, statusText, error) {
                alert(error + ':' + xhr.responseText);
            }
        );
    }

    // async append menu to menus list
    function appendMeal(menuid, meal) {
        $('#no-meals-menu' + menuid).remove();
        meal.rating = calculateRating(meal.reviews);
        return $.get('../../partials/menu-item.ejs', function (template) {
            var newMeal = ejs.compile(template)({ meal: meal, static: false });
            newMeal = $(newMeal).attr('id', 'meal' + meal._id);
            $('#meals-list-menu' + menuid).append(newMeal);
            return meal;
        });
    }

    // deletes meal and updates view
    function deleteMeal(self, menuid) {
        var mealid = self.id.replace('btn-del-meal', '');
        Meal.deleteMeal(mealid).then(
            function success(result) {
                $('#meal' + mealid).remove();
                var contentHeight = $('#content-menu' + menuid).innerHeight();
                var headerHeight = $('#header-menu' + menuid).innerHeight();
                $('#menu' + menuid).height(contentHeight + headerHeight);
            },
            function fail(xhr, statusText, error) {
                alert(error + ':' + xhr.responseText);
            }
        );
    }

    // calculates average rating, given reviews
    function calculateRating(reviews) {
        if (!reviews.length) {
            return 0;
        }
        var rating = 0;
        for (var i = 0; i < reviews.length; i++) {
            rating += reviews[i].rating;
        }
        return Math.round(rating / reviews.length);
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
