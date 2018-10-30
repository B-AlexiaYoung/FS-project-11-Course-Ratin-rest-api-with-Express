'use strict';

// load modules
const express = require('express');
const router = express.Router();
let Course = require("../models/course").Course;
let User = require("../models/user").User;
let Review = require("../models/review").Review;
let auth = require("../authenticate");

// routing get single user ++++++++++++++++++  NEED TO ADD AUTHENTICATION    ++++++++++++++++++++++++++++++++++++
router.get("/", auth.authorizedUser, (req, res, next) =>{
    // if(req.body.email && req.body.password){
    //     User.authenticate();
    // }
    User.findOne({}, 'email password')
    .exec(function(err, users){
        if(err){ 
            return next(err)
        };
        console.log(users);
        res.json(users);
        res.status = 200;
    })

})

// routing creates new user
router.post("/", (req, res, next)=>{
    console.log(req.body);
   User.create(req.body, function (err, newUser){
        if (err){
            err.status = 400;
           return next(err);
            //console.log(err);
        }

        res.redirect("/");
        
    })
    
})




// 
//=========================
module.exports = router;