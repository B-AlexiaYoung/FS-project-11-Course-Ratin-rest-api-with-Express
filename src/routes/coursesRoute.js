'use strict';

// load modules
const express = require('express');
const router = express.Router();
let Review = require("../models/review").Review;
let User = require("../models/user").User;
let Course = require("../models/course").Course;
let auth = require("../authenticate");



// routing api/courses - all courses

router.get("/", (req, res, next) => {   // taken out auth
    Course.find({}, '_id title')
        .exec(function (err, courses) {
            if (err) return next(err);
            res.json(courses);
            res.status = 200;
        })
})

// routing api/courses/courseid  - individual courses
router.get("/:courseId", (req, res, next) => {
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
router.post("/", auth.authorizedUser, (req, res, next) => {
    Course.create(req.body, function (err, newCourse) {
        if (err) {
            res.status(400);
            return next(err);
        }
        res.location("/");
        res.status(201);
        res.end();
    })

})
//routing put update course
router.put("/:cid", auth.authorizedUser, (req, res, next) => {
  
    let courseToUpdate = req.params.cid;
    let updateFields = req.body;

    let findCourse = Course.findOneAndUpdate(
        { _id: courseToUpdate }, updateFields)
        .exec(function (err, courses) {
            if (err) {
                err.status = 400;
                return next(err);
            } else {
                res.status(204);
                res.end();
            }
        })
});

//routing post new review, including no self review validation.
router.post("/:cid/reviews", auth.authorizedUser, (req, res, next) => {
    let userID = req.doc._id
    let reviewedCourse=req.params.cid;
    Course.findById(reviewedCourse)
    .populate('user')
    .populate('review')
    .exec(function (err, course) {
        if (!course) {
            let err = new Error;
            err.status = 400;
            err.message = "Course not found";
            return next(err);
        }
        let teachID = course.user._id;
        let courseID = req.params.cid;
        
        Review.noSelfReview(userID, teachID, function (err) {
            if (err) {
                err.status = 400;
                return next(err);
            } else {
                let newReview = new Review({
                rating: req.body.rating,
                user: userID,
                review: req.body.review,
                postedOn: new Date(),
                })
              
                newReview.save((err) =>{
                    if(err){
                        err.status = 400;
                        return next(err); 
                    }
                    //push to update courses models
                    course.reviews.push({_id: newReview._id});
                    course.save();
                    res.status(201);
                    res.location("/" + courseID);
                    res.end();
                })             
            }
        });
    })
});

//=====================

module.exports = router;