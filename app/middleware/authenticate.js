/* Authentication middleware - for making routes private */
var authenticate = (req, res, next) => {
    if (!req.user) {
        // res.redirect('/signup');
        res.status(401).send();
    } else {
        next();
    }
};

module.exports = {authenticate};
