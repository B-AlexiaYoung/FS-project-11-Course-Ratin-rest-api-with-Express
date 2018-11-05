'use strict';
let Course = require("./course").Course;
let Review = require("./review").Review;
const mongoose = require("mongoose");
let bcrypt = require("bcrypt")

let Schema = mongoose.Schema;
let userSchema = new Schema({
    fullName: {
        type: String,
        required: true,
        trim: true
    },
    emailAddress: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        validate: {
            validator: function (v) {
                return /[^@]+@[^@.]+\.[a-z]+$/i.test(v);
            },
            message: props => `${props.value} This is not a valid email!`
        }
    },
    password: {
        type: String,
        required: true
    },
});





// autenticate user against db
userSchema.statics.authenticate = function (email, password, callback) {

    User.findOne({
            emailAddress: email
        })
        .exec(function (err, user) {
            // console.log(email, password, user);
            if (err) {
                return callback(err);
            } else if (!user) {
                let err = new Error("User not found");
                err.status = 401;
                return callback(err);
            }
            //console.log(user.password);
            bcrypt.compare(password, user.password, function (err, result) {
                console.log(email, user.password, password, result);
                if (result === true) {
                    return callback(null, user)
                } else {
                    let err = new Error("password error");
                    err.status = 401;
                    return callback(err);
                }
            }); // end bcrypt compare
        }) // end exec
}
// pre save hook hash password before saving
userSchema.pre('save', function (next) {
    let user = this;
    bcrypt.hash(user.password, 10, function (err, hash) {
        if (err) {
            return next(err);
        }
        user.password = hash;
        next();
    })
})



//================================
let User = mongoose.model("User", userSchema);
module.exports.User = User;