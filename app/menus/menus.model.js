/***************************************
 * Menu model definition and DB logic
 ***************************************/

(function () {

    'use strict';

    // Globals
    var Menu;
    var schemaDefn = {
        restaurantid: { type: String, required: true },
        name: { type: String, required: true }
    };

    // Review DB logic/config to make available
    module.exports = function () {
        return {
            getSchemaDefn: function () {
                return schemaDefn;
            },
            setModel: function (model) {
                Menu = model;
            },
            readMenu: function (id) {
                return Menu.findById(id).exec();
            },
            readMenus: function (restaurantid) {
                var query;
                var queryFields = [];
                if (restaurantid === 0 || restaurantid) {
                    queryFields.push({ restaurantid: restaurantid });
                }

                query = Menu.find({ $and: queryFields });
                if (!(restaurantid === 0 || restaurantid)) {
                    query = Menu.find();

                }
                return query.exec();
            },
            createMenu: function (restaurantid, name) {
                var newMenu = new Menu();
                if (restaurantid) newMenu.restaurantid = restaurantid;
                if (name) newMenu.name = name;
                return newMenu.save();
            },
            updateMenu: function (id, name) {
                var updatedFields = {};
                if (name) updatedFields.name = name;
                return Menu.findByIdAndUpdate(
                    id,
                    { $set: updatedFields },
                    { new: true }
                ).exec();
            },
            deleteMenu: function (id) {
                return Menu.findByIdAndRemove(id).exec();
            }
        };
    };

})();
