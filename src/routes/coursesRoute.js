'use strict';

// load modules
const express = require('express');
const router = express.Router();
let Review = require("../models/review").Review;
let User = require("../models/user").User;
let Course = require("../models/course").Course;
let auth = require("../authenticate");


// routing api/courses - all courses

router.get("/", (req, res, next) => {
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
        .populate('user')
        .populate('reviews')
        .exec(function (err, courses) {
            if (err){
                 return next(err);
            }
            res.json(courses);
            res.status = 200;
        })
})


//routing post creates a new course
//router.post("/", auth.authorizedUser, (req, res, next)=>{
router.post("/", (req, res, next) => {
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
router.put("/:cid",(req, res, next)=>{
    //console.log(req.params.cid);
    //console.log(req.body);
    let courseToUpdate = req.params.cid

    let updateFields = req.body;
    let findCourse= Course.findOneAndUpdate({_id: courseToUpdate},updateFields)
    .exec( function (err, courses) {
        if (err) {
            err.status=400;
            return next(err);
        }else{
        res.json(courses);
        res.status(204);
        console.log(res.statusCode)
        }
    })

//})
});

//post new review
 router.post("/:cid/reviews", (req, res, next) => {
    console.log(req.params.cid);
 Course.findById(req.params.cid)
    .populate('user')
    .populate('review')
    .exec(function (err, course){
        if(!course){
            let err = new Error;
            err.status = 400;
            err.message ="Course not found";
           return next(err);
        }
        console.log(course.user._id);

       console.log(course.user._id);
         if (req.params.cid === course.user._id){
            console.log(course.user._id);

         let err = new Error ("Only other people can review your course") ;
         err.status = 403;
         return next(err);
     }
     let newReview = req.body;
     newReview.user = course.user._id;
     newReview.postedOn = new Date();
     
     Review.create(newReview);
     res.redirect("/:" + req.params.cid);
   })
 });

//=====================
module.exports = router;