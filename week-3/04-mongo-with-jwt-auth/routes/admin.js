const { Router } = require("express");
const adminMiddleware = require("../middleware/admin");
const jwt = require("jsonwebtoken");
const { Admin, Course } = require("../db");
const router = Router();
const secret = require("../config.js");

// Admin Routes
router.post('/signup', async (req, res) => {
    // Implement admin signup logic
    const username = req.body.username;
    const password = req.body.password;
    const newAdmin = new Admin({username : username, password : password});
    await newAdmin.save();
    res.status(200).send("Admin created successfuly");
});

router.post('/signin', async (req, res) => {
    // Implement admin signin logic
    try {
        const username = req.body.username;
        const password = req.body.password;
        const findAdmin = await Admin.findOne({username : username});
        console.log(findAdmin);
        console.log(findAdmin.password);
        if(!findAdmin || !(password === findAdmin.password)) {
            res.status(411).json({msg : "Invalid Admin credentials"});
        } else {
            console.log("inside jwt");
            const myToken = jwt.sign({username : username}, secret);
            res.status(200).json({token : myToken});
        }
    } catch {
        res.status(500).json({msg : "Error in signin"});
    }
});

router.post('/courses', adminMiddleware, async (req, res) => {
    // Implement course creation logic
    const {title,description,price,imageLink}=req.body;
    const course = new Course({
        title : title,
        description : description,
        price : parseInt(price), 
        imageLink : imageLink
    })
    await course.save();
    res.status(200).send("Course created Successfully with course ID: " + course._id);
});

router.get('/courses', adminMiddleware, async (req, res) => {
    // Implement fetching all courses logic
    let course = await Course.find();
    if(!course) {
        res.status(411).json({msg : "Error in fetching the data"});
    } else {
        res.status(200).json({course : course});
    }
});

module.exports = router;