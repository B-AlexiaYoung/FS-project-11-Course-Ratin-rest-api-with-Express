'use strict';

// load modules
const express = require('express');
const router = express.Router();
let Review = require("../models/review").Review;
let User = require("../models/user").User;
let Course = require("../models/course").Course;
let auth = require("../authenticate");
//let noSelfReview= require("../models/review").noSelfReview;



// routing api/courses - all courses

router.get("/", auth.authorizedUser, (req, res, next) => {
    Course.find({}, '_id title')
        .exec(function (err, courses) {
            if (err) return next(err);
            res.json(courses);
            res.status = 200;
        })
})

// routing api/courses/courseid  - individual courses
router.get("/:courseId", auth.authorizedUser, (req, res, next) => {
    console.log(req.params);
    Course.findById(req.params.courseId)
        .populate('user', "_id fullName")
        .populate('reviews')
        .exec(function (err, courses) {
            if (err) {
                return next(err);
            }
            res.json(courses);
            res.status = 200;
        })
})


//routing post creates a new course
//router.post("/", auth.authorizedUser, (req, res, next)=>{
router.post("/", auth.authorizedUser, (req, res, next) => {
    console.log(req.body);
    Course.create(req.body, function (err, newCourse) {
        if (err) {
            res.status(400);
            return next(err);
            console.log(err);
        }
        res.redirect("/")
    })

})
//routing put update course
router.put("/:cid", auth.authorizedUser, (req, res, next) => {
    //console.log(req.params.cid);
    //console.log(req.body);
    let courseToUpdate = req.params.cid

    let updateFields = req.body;
    let findCourse = Course.findOneAndUpdate({
            _id: courseToUpdate
        }, updateFields)
        .exec(function (err, courses) {
            if (err) {
                err.status = 400;
                return next(err);
            } else {
                //res.json(courses);
                res.status(204);
                console.log(res.statusCode);
                res.end();
            }
        })

    //})
});

//post new review
router.post("/:cid/reviews", auth.authorizedUser, (req, res, next) => {
//console.log(req.doc._id); 
    let userID = req.doc._id
    let reviewedCourse=req.params.cid;
    Course.findById(reviewedCourse)
    .populate('user')
    .populate('review')
    .exec(function (err, course) {
        console.log(req.body);
        if (!course) {
            let err = new Error;
            err.status = 400;
            err.message = "Course not found";
            return next(err);
        }
        let teachID = course.user._id;
        console.log(userID);
        console.log(teachID);
        let courseID = req.params.cid;
        Review.noSelfReview(userID, teachID, function (err) {
                    //console.log("should be running");
            if (err) {
                err.status = 400;
                //res.end();
                return next(err);
            } else {
                let newReview = new Review({
                rating: req.body.rating,
                user: userID,
                review: req.body.review,
                postedOn: new Date(),
                })
              
                console.log(newReview);
                //let newReview = req.body;
                //newReview.user = course.user._id;
                //newReview.postedOn = new Date();
                newReview.save((err) =>{
                    if(err){
                        err.status = 400;
                        return next(err); 
                    }
                    course.reviews.push({_id: newReview._id});
                    course.save();
                })
                
                console.log(newReview);
                console.log(newReview._id);
                console.log(course.reviews);

                //console.log (Course.review);

                // add update to course for review
                    res.status(201);
                    res.location("/" + courseID);
                    res.end();

                
            }
        });
    })
});

        //=====================

        module.exports = router;