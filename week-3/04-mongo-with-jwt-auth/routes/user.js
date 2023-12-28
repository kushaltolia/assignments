const { Router } = require("express");
const secret = require("../config.js");
const router = Router();
const mongoose = require('mongoose');
const userMiddleware = require("../middleware/user");
const { User, Course } = require("../db");
const jwt = require("jsonwebtoken");

// User Routes
router.post('/signup', (req, res) => {
    // Implement user signup logic
    const username = req.body.username;
    const password = req.body.password;
    const newUser = new User({username : username, password : password});
    newUser.save();
    res.status(200).json("User created successfully");
});

router.post('/signin', async (req, res) => {
    // Implement admin signup logic
    const username = req.body.username;
    const password = req.body.password;
    try {
        const findUser = await User.findOne({username : username});
        if(!findUser || !(password === findUser.password)) {
            res.status(411).json({msg : "Invalid Credentials"});
        } else {
            const myToken = jwt.sign({username : username}, secret);
            res.status(200).json({token : myToken});
        }
    } catch {
        res.status(500).send("Error in signin");
    }
});

router.get('/courses', async (req, res) => {
    // Implement listing all courses logic
    let course = await Course.find();
    if(!course) {
        res.status(411).send("Error in fetching the courses");
    } else {
        res.json({course});
    }

});

router.post('/courses/:courseId', userMiddleware, async (req, res) => {
    // Implement course purchase logic
    const courseId = req.params.courseId;
    const authHeader = req.headers.authorization;
    const words = authHeader.split(" ");
    const jwtToken = words[1];
    const decodedValue = jwt.verify(jwtToken, secret);
    await User.updateOne({
        username : decodedValue.username
    }, {
        "$push" : {
            purchasedCourses : new mongoose.Types.ObjectId(courseId)
        }
    })
    res.status(200).json({
        msg : "you successfuly purchased the course"
    })
});

router.get('/purchasedCourses', userMiddleware, async (req, res) => {
    // Implement fetching purchased courses logic
    const user = await User.findOne({
        username : req.headers.username
    })
    const courses = await Course.find({
        _id : {
            "$in" : user.purchasedCourses
        }
    })
    res.json({
        courses : courses
    })
});

module.exports = router