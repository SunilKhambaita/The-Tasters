/***************************************
 * User model definition and DB logic
 ***************************************/

(function () {

    'use strict';

    var validator = require('validator');

    // Globals
    var User;
    var schemaDefn = {
        email: { type: String, required: true, unique: true, trim: true, minlength: 1,
                validate: {
                    isAsync: true,
                    validator: validator.isEmail,
                    message: '{VALUE} is not a valid email.'
                }
               },
        password: { type: String, required: true, trim: true},
        name: { type: String, required: true, trim: true},
        bio: { type: String, default: '', trim: true},
        location: { type: String, default: '', trim: true},
        joined: { type: Date, default: Date.now},
        type: { type: String, default: 'customer'},
        image: { type: String, default: './../public/assets/img/default-profile00'}
    };

    // User DB logic/config to make available
    module.exports = function () {
        return {
            getSchemaDefn: function () {
                return schemaDefn;
            },
            setModel: function (model) {
                User = model;
            },
            readUsers: function (query) {
                return User.find(query).sort({username:1}).exec();
            },
            readUser: function (id, email) {
                var queryFields = [];
                if (id) queryFields.push({ _id: id });
                if (email) queryFields.push({ email: email });
                if (!id && !email) queryFields.push({ _id: null });
                return User.findOne({ $and: queryFields }).exec();
            },
            createUser: function (email, password, name, bio, location, type, image) {
                var newUser = new User();
                if (email) newUser.email = email;
                if (password) newUser.password = password;
                if (name) newUser.name = name;
                if (bio) newUser.bio = bio;
                if (location) newUser.location = location;
                if (type) newUser.type = type;
                if (image) newUser.image = image;
                return newUser.save();
            },
            updateUser: function (id, email, password, name, bio, location, image) {
                var updatedFields = {};
                if (email) updatedFields.email = email;
                if (password) updatedFields.password = password;
                if (name) updatedFields.name = name;
                if (bio) updatedFields.bio = bio;
                if (location) updatedFields.location = location;
                if (image) updatedFields.image = image;
                return User.findByIdAndUpdate(
                    id,
                    { $set: updatedFields },
                    { new: true }
                ).exec();
            },
            deleteUser: function (id) {
                return User.findByIdAndRemove(id).exec();
            }
        };
    };

})();
