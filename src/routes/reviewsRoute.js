'use strict';

// load modules
const express = require('express');
const router = express.Router();
let Course = require("../models/course").Course;
let User = require("../models/user").User;
let Review = require("../models/review").Review;
let auth = require("../authenticate")


//=========================
module.exports = router;