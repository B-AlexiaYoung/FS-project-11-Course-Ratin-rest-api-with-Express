'use strict';
const mongoose = require("mongoose");
let User = require("./user").User;
let Course = require("./course").Course;
let Schema = mongoose.Schema;
let reviewSchema = new Schema
({
    user:[Schema.Types.ObjectId], // from the users collection,
    postedOn: 
    {
        type: Date, 
        defaults: Date.now,
       
    },
    rating:
    {
        type: Number,
        required : true,
        min: 1,
        max: 5,
    }, // add must fall between 1 and 5
    review:
    {
        type:String
    },
})



//================================
module.exports.Review= mongoose.model("Review", reviewSchema);
