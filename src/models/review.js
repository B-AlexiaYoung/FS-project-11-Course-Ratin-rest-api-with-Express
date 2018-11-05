'use strict';
const mongoose = require("mongoose");
let User = require("./user").User;
let Course = require("./course").Course;
let Schema = mongoose.Schema;
let reviewSchema = new Schema({
    user: [Schema.Types.ObjectId], // from the users collection,
    // user:{
    //     type: Schema.Types.ObjectId,
    //     validate: noSelfReview
    // },
    postedOn: {
        type: Date,
        defaults: Date.now,

    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
    }, // add must fall between 1 and 5
    review: {
        type: String
    },
})

// add method validation
reviewSchema.statics.noSelfReview = function (userID, teacherID, matchCallback) {
    console.log("whhop");
    let testUser = userID.toString();
    let testTeach = teacherID.toString();
    console.log(testUser, testTeach)

    if (testUser === testTeach) {
        console.log(testUser, testTeach)
        //console.log(course.user._id,"wibble");

        let err = new Error("Only other people can review your course");
        err.status = 403;
        matchCallback(err);
    }else{
        matchCallback();
    }
}

//================================
//module.exports.noSelfReview= noSelfReview;
module.exports.Review = mongoose.model("Review", reviewSchema);