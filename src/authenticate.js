'use strict';
let auth = require('basic-auth');
let User = require("./models/user").User;

function authorizedUser(req, res, next) {

    let verify = auth(req);

    if (verify) {
        let mail = verify.name;
        let pass = verify.pass;
        User.authenticate(mail, pass, function (err, user) {
            if (err || !user) {
                let err = new Error("There was either no email or password found");
                err.status = 401;
                return next(err);
            } else {
                req.doc = user;
                return next();

            }
        });
    } else {
        let err = new Error("Email and password are required");
        err.status = 401;
        return next(err);
    }

}


//============================================
module.exports.authorizedUser = authorizedUser;