'use strict';
const mongoose = require("mongoose");
let Schema = mongoose.Schema;
let User = require("./user").User;
let Review = require("./review").Review;
let courseSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }, // from users collection,
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    estimatedTime: {
        type: String
    },
    naterialsNeeded: {
        type: String
    },
    steps: [{
        stepNumber: {
            type: Number
        },
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },

    }],
    reviews: [{
        type: Schema.Types.ObjectId, //from reviews collection
        ref: 'Review'
    }]
})



//================================
module.exports.Course = mongoose.model("Course", courseSchema);