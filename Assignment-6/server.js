/*********************************************************************************
*  WEB700 – Assignment 05
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part 
*  of this assignment has been copied manually or electronically from any other source 
*  (including 3rd party web sites) or distributed to other students.
* 
*  Name: Jadhusan M Sadhik Student ID: 155547227 Date: 4/6/2024
*
*  Online (Cycliic) Link: 
*
********************************************************************************/ 



// Setting up the HTTP port to listen on, defaulting to 8080

var HTTP_PORT = process.env.PORT || 8080;
var express = require("express");
var app = express();
var path = require("path");
const exphbs = require('express-handlebars');

// Set up handlebars view engine with custom helpers
const hbs = exphbs.create({
    extname: '.hbs',
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname, 'views/layouts/'),
    helpers: {
        navLink: function(url, options){
            return '<li' +
                ((url == app.locals.activeRoute) ? ' class="nav-item active"' : ' class="nav-item"') +
                '><a class="nav-link" href="' + url + '">' + options.fn(this) + '</a></li>';
        },
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

// Setting up the Handlebars engine for rendering views
app.engine('.hbs', hbs.engine);
app.set('view engine', '.hbs');

// Serving static files from the 'public' directory
app.use(express.static('public'));

// Adding middleware to parse URL-encoded bodies with extended options
app.use(express.urlencoded({ extended: true }));

// Requiring the collegeData module from the modules folder
var collegeData = require("./modules/collegeData.js");

// Middleware to set activeRoute in app.locals
app.use(function(req, res, next){
    let route = req.path.substring(1);
    app.locals.activeRoute = '/' + (route == '/' ? '' : route);
    next();
});

// Initializing data and setting up routes
collegeData.initialize().then(() => {
    console.log("Data initialized. Setting up the routes.");

    // Serving static files from the 'views' directory
    app.use(express.static(path.join(__dirname, 'views')));

    // Rendering home page
    app.get("/", (req, res) => {
        res.render("home", { title: "Home Page" });
    });

    // Rendering page for listing students
    app.get("/students", (req, res) => {
        collegeData.getAllStudents()
            .then(students => {
                if (students.length > 0) {
                    res.render("students", { students: students });
                } else {
                    res.render("students", { message: "No results" });
                }
            })
            .catch(err => {
                console.error("Error retrieving students: ", err);
                res.render("students", { message: "Unable to fetch students" });
            });
    });

    // Rendering page for listing courses
    app.get("/courses", (req, res) => {
        collegeData.getCourses()
            .then((data) => {
                if (data.length > 0) {
                    res.render("courses", { courses: data });
                } else {
                    res.render("courses", { message: "No results" });
                }
            })
            .catch(err => {
                console.error(err);
                res.render("courses", { message: "Unable to fetch courses" });
            });
    });

    // Rendering about page
    app.get("/about", (req, res) => {
        res.render("about");
    });

    // Rendering HTML demo page
    app.get("/htmlDemo", (req, res) => {
        res.render('htmlDemo');
    });

    // Rendering page for adding a new student
    app.get("/students/add", (req, res) => {
        collegeData.getCourses()
            .then(courses => {
                res.render("addStudent", { courses: courses });
            })
            .catch(err => {
                console.error(err);
                res.render("addStudent", { courses: [] });
            });
    });

    // Handling addition of a new student
    app.post("/students/add", (req, res) => {
        if (req.body.course === "") {
            req.body.course = null;
        }
    
        collegeData.addStudent(req.body)
            .then(() => {
                res.redirect("/students");
            })
            .catch((err) => {
                console.error(err);
                collegeData.getCourses()
                    .then(courses => {
                        res.render("addStudent", { 
                          error: "Unable to add student", 
                          studentData: req.body, 
                          courses: courses 
                        });
                    })
                    .catch(err => {
                        res.render("addStudent", { 
                          error: "Unable to add student", 
                          studentData: req.body, 
                          courses: [] 
                        });
                    });
            });
    });

    // Rendering course details page by ID
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

    // Rendering student details page by student number
    app.get('/student/:studentNum', (req, res) => {
        let viewData = {};

        collegeData.getStudentByNum(req.params.studentNum).then((student) => {
            if (student) {
                viewData.student = student;
            } else {
                viewData.student = null;
            }
        }).catch((err) => {
            viewData.student = null;
        }).then(collegeData.getCourses)
        .then((courses) => {
            viewData.courses = courses;
            res.render("student", { viewData: viewData });
        }).catch((err) => {
            viewData.courses = [];
            res.render("student", { viewData: viewData });
        });
    });

    // Handling update of student data
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

    // Rendering form for adding a new course
    app.get("/courses/add", (req, res) => {
        res.render("addCourse");
    });

    // Handling addition of a new course
    app.post("/courses/add", (req, res) => {
        collegeData.addCourse(req.body)
            .then(() => {
                res.redirect("/courses");
            })
            .catch((err) => {
                console.error(err);
                res.status(500).send("Unable to add course");
            });
    });

    // Rendering form for updating course details
    app.get("/courses/update/:id", (req, res) => {
        collegeData.getCourseById(req.params.id)
            .then((course) => {
                if (course) {
                    res.render("updateCourse", { course: course });
                } else {
                    res.status(404).send("Course Not Found");
                }
            })
            .catch((err) => {
                console.error(err);
                res.status(500).send("Unable to retrieve course for update");
            });
    });

    // Handling update of course details
    app.post("/courses/update", (req, res) => {
        collegeData.updateCourse(req.body)
            .then(() => {
                res.redirect("/courses");
            })
            .catch((err) => {
                console.error(err);
                res.status(500).send("Unable to update course");
            });
    });

    // Handling deletion of a course
    app.get("/courses/delete/:id", (req, res) => {
        collegeData.deleteCourseById(req.params.id)
            .then(() => {
                res.redirect("/courses");
            })
            .catch((err) => {
                console.error(err);
                res.status(500).send("Unable to remove course");
            });
    });

    // Handling deletion of a student
    app.get('/student/delete/:studentNum', (req, res) => {
        collegeData.deleteStudentByNum(req.params.studentNum)
        .then((msg) => {
            res.redirect('/students');
        })
        .catch((err) => {
            res.status(500).send(err);
        });
    });
    
    
    

    // Catch-all route for handling unmatched routes
    app.use((req, res) => {
        res.status(404).send("Page Not Found");
    });

    // Start the server after the data has been initialized
    app.listen(HTTP_PORT, () => {
        console.log("Server listening on port: " + HTTP_PORT);
    });

}).catch(err => {
    console.error("Failed to initialize data:", err);
});



