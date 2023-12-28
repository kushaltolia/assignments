const { Router } = require("express");
const adminMiddleware = require("../middleware/admin");
const { Admin, Course } = require("../db");
const router = Router();

// Admin Routes
router.post('/signup', async (req, res) => {
    // Implement admin signup logic
    const username = req.body.username;
    const password = req.body.password;
    const admin = new Admin({
        username : username,
        password : password
    });
    admin.save();
    res.status(200).send("Admin Created Successfully");
});

router.post('/courses', adminMiddleware, async (req, res) => {
    // Implement course creation logic
    const {title,description,price,imageLink}=req.body;
    const newCourse = new Course({
        title : title,
        description : description,
        price : parseInt(price), 
        imageLink : imageLink, 
    })
    await newCourse.save();
    //alternative syntax for creating in database
    // const newCourse = await Course.create({
    //     title : title,
    //     description : description,
    //     price : price,
    //     imageLink : imageLink
    // })
    res.status(200).send("Course created Successfully with course ID: " + newCourse._id);
});

router.get('/courses', adminMiddleware, async(req, res) => {
    // Implement fetching all courses logic
    const course = await Course.find();
    res.json({courses : course})
});

module.exports = router;