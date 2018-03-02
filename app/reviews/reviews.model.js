/***************************************
 * Review model definition and DB logic
 ***************************************/

(function () {

    'use strict';

    // Globals
    var Review;
    var schemaDefn = {
        userid: { type: String, required: true },
        mealid: { type: String, required: true },
        rating: { type: String, required: true },
        comment: { type: String, default: '' },
        date: { type: Date, default: Date.now }
    };

    // Review DB logic/config to make available
    module.exports = function () {
        return {
            getSchemaDefn: function () {
                return schemaDefn;
            },
            setModel: function (model) {
                Review = model;
            },
            readReview: function (id) {
                return Review.findById(id).exec();
            },
            readReviews: function (userid, mealid) {
                var query;
                var queryFields = [];

                if (userid === 0 || userid) queryFields.push({ userid: userid });
                if (mealid === 0 || mealid) queryFields.push({ mealid: mealid });

                query = Review.find({ $and: queryFields });
                if (!(userid === 0 || userid) && !(mealid === 0 || mealid)) {
                    query = Review.find();
                }
                return query.exec();
            },
            createReview: function (userid, mealid, rating, comment) {
                var newReview = new Review();
                if (userid === 0 || userid) newReview.userid = userid;
                if (mealid === 0 || mealid) newReview.mealid = mealid;
                if (rating) newReview.rating = parseInt(rating, 10);
                if (comment) newReview.comment = comment;
                return newReview.save();
            },
            updateReview: function (id, rating, comment) {
                var updatedFields = {};
                if (rating) updatedFields.rating = parseInt(rating, 10);
                if (comment) updatedFields.comment = comment;
                return Review.findByIdAndUpdate(
                    id,
                    { $set: updatedFields },
                    { new: true }
                ).exec();
            },
            deleteReview: function (id) {
                return Review.findByIdAndRemove(id).exec();
            },
            deleteReviews: function (userid, mealid) {
                var queryFields = [];
                if (userid === 0 || userid) queryFields.push({ userid: userid });
                if (mealid === 0 || mealid) queryFields.push({ mealid: mealid });

                // guarantee no reviews will be found if no fields provided
                if (!(userid === 0 || userid) && !(mealid === 0 || mealid)) {
                    queryFields.push({ userid: null });
                }

                return Review.find({ $and: queryFields }).remove().exec();
            }
        };
    };

})();
