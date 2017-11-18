const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    if(req.cookies && req.cookies.token) {
        jwt.verify(req.cookies.token, "~!@#$%^*()_", (err, decoded) => {
            if (!err && decoded) {
                req.user = decoded;
            }
        });
    }
    next();
}