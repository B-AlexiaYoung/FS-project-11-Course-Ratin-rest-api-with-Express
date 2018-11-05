'use strict';

// load modules
const express = require('express');
const router = express.Router();
let Course = require("../models/course").Course;
let User = require("../models/user").User;
let Review = require("../models/review").Review;
let auth = require("../authenticate");

// routing get single user 
router.get("/", auth.authorizedUser, (req, res, next) => {
   
    let eAddress = req.doc.emailAddress;

    User.findOne({
            emailAddress: eAddress
        }, 'email password')
        .exec(function (err, users) {
            if (err) {
                return next(err)
            };
            res.json(users);
            res.status = 200;
        })

})

// routing creates new user
router.post("/", (req, res, next) => {
    User.create(req.body, function (err, newUser) {
        if (err) {
            err.status = 400;
            return next(err);
        }

        res.location("/");
        res.status(201);
        res.end();

    })

})




// 
//=========================
module.exports = router;