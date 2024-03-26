/*********************************************************************************
*  WEB700 – Assignment 05
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part 
*  of this assignment has been copied manually or electronically from any other source 
*  (including 3rd party web sites) or distributed to other students.
* 
*  Name: Jadhusan M Sadhik Student ID: 155547227 Date: 3/25/2024
*
*  Online (Cycliic) Link: 
*
********************************************************************************/ 



// Setting up the HTTP port to listen on, defaulting to 8080
var HTTP_PORT = process.env.PORT || 8080;
// Importing necessary modules
var express = require("express");
var app = express();
var path = require("path");
const exphbs = require('express-handlebars');

// Configuring Handlebars view engine with custom helpers
const hbs = exphbs.create({
    extname: '.hbs',
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname, 'views/layouts/'),
    helpers: {
        // Helper for creating navigation links with active state
        navLink: function(url, options){
            return '<li' +
                ((url == app.locals.activeRoute) ? ' class="nav-item active"' : ' class="nav-item"') +
                '><a class="nav-link" href="' + url + '">' + options.fn(this) + '</a></li>';
        },
        // Helper for comparing values in Handlebars
        equal: function(lvalue, rvalue, options) {
            if (options.fn) {
                if (lvalue === rvalue) {
                    return options.fn(this);
                } else {
                    return options.inverse(this);
                }
            }
            return lvalue === rvalue;
        }
    }
});

// Configuring Handlebars engine
app.engine('.hbs', hbs.engine);

// Setting Handlebars as the view engine
app.set('view engine', '.hbs');

// Serving static files from the 'public' directory
app.use(express.static('public'));

// Adding middleware to parse urlencoded request bodies
app.use(express.urlencoded({ extended: true }));

// Requiring the collegeData module from the modules folder
var collegeData = require("./modules/collegeData.js");

// Middleware to set activeRoute in app.locals
app.use(function(req, res, next){
    let route = req.path.substring(1);
    app.locals.activeRoute = '/' + (route == '/' ? '' : route);
    next();
});

// Initializing data before setting up routes
collegeData.initialize().then(() => {
    console.log("Data initialized. Setting up the routes.");

    // Serving static files from the 'views' directory
    app.use(express.static(path.join(__dirname, 'views')));

    // Handling requests for the home page
    app.get("/", (req, res) => {
        res.render("home", {
            title: "Home Page"
        });
    });

    // Handling requests for the students page
    app.get("/students", (req, res) => {
        if (req.query.course) {
            collegeData.getStudentsByCourse(req.query.course)
                .then(students => {
                    if(students.length > 0){
                        res.render("students", { students: students });
                    } else {
                        res.render("students", { message: "No students found for this course." });
                    }
                })
                .catch(err => {
                    console.log(err);
                    res.render("students", { message: "Error retrieving students." });
                });
        } else {
            collegeData.getAllStudents()
                .then(students => {
                    res.render("students", { students: students });
                })
                .catch(err => {
                    console.log(err);
                    res.render("students", { message: "Error retrieving students." });
                });
        }
    });

    // Handling requests for the courses page
    app.get("/courses", (req, res) => {
        collegeData.getCourses()
            .then(courses => {
                if(courses.length > 0){
                    res.render("courses", { courses: courses });
                } else {
                    res.render("courses", { message: "No courses available." });
                }
            })
            .catch(error => {
                res.render("courses", { message: "Unable to retrieve courses." });
            });
    });

    // Handling requests for the about page
    app.get("/about", (req, res) => {
        res.render("about")
    });

    // Handling requests for the HTML demo page
    app.get("/htmlDemo", (req, res) => {
        res.render('htmlDemo');
    });

    // Handling requests for adding a new student
    app.get("/students/add", (req, res) => {
        res.render('addStudent');
    });

    // Handling POST requests for adding a new student
    app.post("/students/add", (req, res) => {
        collegeData.addStudent(req.body)
            .then(() => {
                res.redirect("/students");
            })
            .catch((err) => {
                console.error(err);
                res.status(500).send("Unable to add student");
            });
    });

    // Handling requests for a specific course by ID
    app.get("/course/:id", (req, res) => {
        collegeData.getCourseById(req.params.id)
            .then((course) => {
                console.log(course);
                res.render("course", { course: course });
            })
            .catch((err) => {
                console.error(err);
                res.render("course", { message: "This course does not exist." });
            });
    });

    // Handling requests for a specific student by student number
    app.get('/student/:studentNum', (req, res) => {
        Promise.all([
            collegeData.getStudentByNum(req.params.studentNum),
            collegeData.getCourses()
        ])
        .then(([studentData, coursesData]) => {
            console.log('Courses data:', coursesData);
            res.render('student', {
                student: studentData,
                courses: coursesData
            });
        })
        .catch(err => {
            console.error(err);
            res.status(500).send('Error loading student edit form');
        });
    });

    // Handling POST requests for updating a student
    app.post('/student/update', (req, res) => {
        collegeData.updateStudent(req.body)
            .then(() => {
                res.redirect('/students');
            })
            .catch(err => {
                console.error(err);
                res.status(500).send("Unable to update student.");
            });
    });

    // Catch-all route for handling unmatched routes
    app.use((req, res) => {
        res.status(404).send("Page Not Found");
    });

    // Starting the server after data initialization
    app.listen(HTTP_PORT, () => {
        console.log("Server listening on port: " + HTTP_PORT);
    });

}).catch(err => {
    console.error("Failed to initialize data:", err);
});
