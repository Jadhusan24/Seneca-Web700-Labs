/*********************************************************************************
*  WEB700 – Assignment 03
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part 
*  of this assignment has been copied manually or electronically from any other source 
*  (including 3rd party web sites) or distributed to other students.
* 
*  Name: Jadhusan M Sadhik Student ID: 155547227 Date:2/17/2024
*
********************************************************************************/

// Import necessary modules
const express = require("express");
const path = require("path");
const collegeData = require("./modules/collegeData.js");

// Set up express app
const app = express();

// Define HTTP port, fallback to 8080 if not provided by environment
const HTTP_PORT = process.env.PORT || 8080;

// Function to start the server
function startServer() {
    // Log server start
    console.log("Server listening on port: " + HTTP_PORT);
    // Start the server
    app.listen(HTTP_PORT);
}

// Function to handle server initialization errors
function handleInitializationError(err) {
    console.error(err);
    console.error("Failed to initialize college data. Server not started.");
}

// Initialize college data and handle initialization promise
collegeData.initialize()
    .then(() => {
        // Set up routes

        // GET /students
        app.get("/students", (req, res) => {
            // Handle request for all students or by specific course
            let course = req.query.course;
            if (course) {
                collegeData.getStudentsByCourse(course)
                    .then(students => res.json(students.length > 0 ? students : { message: "no results" }))
                    .catch(err => res.status(500).json({ error: "Internal Server Error" }));
            } else {
                collegeData.getAllStudents()
                    .then(students => res.json(students.length > 0 ? students : { message: "no results" }))
                    .catch(err => res.status(500).json({ error: "Internal Server Error" }));
            }
        });

        // GET /tas
        app.get("/tas", (req, res) => {
            collegeData.getTAs()
                .then(tas => res.json(tas.length > 0 ? tas : { message: "no results" }))
                .catch(err => res.status(500).json({ error: "Internal Server Error" }));
        });

        // GET /courses
        app.get("/courses", (req, res) => {
            collegeData.getCourses()
                .then(courses => res.json(courses.length > 0 ? courses : { message: "no results" }))
                .catch(err => res.status(500).json({ error: "Internal Server Error" }));
        });

        // GET /student/num
        app.get("/student/:num", (req, res) => {
            let num = req.params.num;
            collegeData.getStudentByNum(num)
                .then(student => res.json(student ? student : { message: "no results" }))
                .catch(err => res.status(500).json({ error: "Internal Server Error" }));
        });

        // GET /htmlDemo
        app.get("/htmlDemo", (req, res) => res.sendFile(path.join(__dirname, "views", "htmlDemo.html")));

        // GET /about
        app.get("/about", (req, res) => res.sendFile(path.join(__dirname, "views", "about.html")));

        // GET /
        app.get("/", (req, res) => res.sendFile(path.join(__dirname, "views", "home.html")));

        // Handle unmatched routes
        app.use((req, res) => res.status(404).send("Page Not Found"));

        // Start the server
        startServer();
    })
    .catch(handleInitializationError); // Handle initialization error
