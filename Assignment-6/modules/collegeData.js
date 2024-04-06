// Import Sequelize library
const Sequelize = require('sequelize');
// postgresql://SenecaDB_owner:OufHRoqN3K2g@ep-empty-feather-a596ey04.us-east-2.aws.neon.tech/SenecaDB?sslmode=require
// Establish connection to the PostgreSQL database
var sequelize = new Sequelize('SenecaDB', 'SenecaDB_owner', 'OufHRoqN3K2g', {
    host: 'ep-empty-feather-a596ey04.us-east-2.aws.neon.tech',
    dialect: 'postgres',
    port: 5432,
    dialectOptions: {
        ssl: { rejectUnauthorized: false }
    },
    query: { raw: true }
});

// Define the Student model
const Student = sequelize.define('Student', {
    studentNum: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    firstName: Sequelize.STRING,
    lastName: Sequelize.STRING,
    email: Sequelize.STRING,
    addressStreet: Sequelize.STRING,
    addressCity: Sequelize.STRING,
    addressProvince: Sequelize.STRING,
    TA: Sequelize.BOOLEAN,
    status: Sequelize.STRING
});

// Define the Course model
const Course = sequelize.define('Course', {
    courseId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    courseCode: Sequelize.STRING,
    courseDescription: Sequelize.STRING
});

// Define the relationship between Course and Student models
Course.hasMany(Student, { foreignKey: 'course' });

// Function to initialize database
module.exports.initialize = function () {
    return new Promise((resolve, reject) => {
        sequelize.sync()
        .then(() => resolve('Database synced successfully'))
        .catch(err => {
            console.error('Error syncing the database:', err);
            reject('Unable to sync the database');
        });
    });
};

// Function to get all students
module.exports.getAllStudents = function() {
    return new Promise((resolve, reject) => {
        Student.findAll()
        .then(students => {
            if (students && students.length > 0) {
                resolve(students);
            } else {
                reject("No results returned");
            }
        })
        .catch(err => {
            console.error('Error retrieving all students:', err);
            reject("Unable to retrieve students");
        });
    });
};

// Function to get all TAs (Teaching Assistants)
module.exports.getTAs = function () {
    return new Promise(function (resolve, reject) {
        reject("Not implemented");
    });
};

// Function to get all courses
module.exports.getCourses = function() {
    return new Promise((resolve, reject) => {
        Course.findAll()
        .then(courses => {
            if (courses && courses.length > 0) {
                resolve(courses);
            } else {
                reject("No results returned");
            }
        })
        .catch(err => {
            console.error('Error retrieving courses:', err);
            reject("Unable to retrieve courses");
        });
    });
};

// Function to get a student by student number
module.exports.getStudentByNum = function(num) {
    return new Promise((resolve, reject) => {
        Student.findAll({
            where: { studentNum: num }
        })
        .then(students => {
            if (students && students.length > 0) {
                resolve(students[0]);
            } else {
                reject("No results returned");
            }
        })
        .catch(err => {
            console.error('Error retrieving student by number:', err);
            reject("Unable to retrieve student by number");
        });
    });
};

// Function to get students by course
module.exports.getStudentsByCourse = function(course) {
    return new Promise((resolve, reject) => {
        Student.findAll({
            where: { course: course }
        })
        .then(students => {
            if (students && students.length > 0) {
                resolve(students);
            } else {
                reject("No results returned");
            }
        })
        .catch(err => {
            console.error('Error retrieving students by course:', err);
            reject("Unable to retrieve students for the course");
        });
    });
};

// Function to add a new student
module.exports.addStudent = function (studentData) {
    return new Promise((resolve, reject) => {
        studentData.TA = studentData.TA ? true : false;
        Object.keys(studentData).forEach(key => {
            if (studentData[key] === "") {
                studentData[key] = null;
            }
        });
        Student.create(studentData)
            .then(student => {
                resolve(student);
            })
            .catch(err => {
                if (err.name === 'SequelizeValidationError') {
                    console.error('Validation errors:', err.errors.map(e => e.message));
                    reject('Validation error: ' + err.errors.map(e => e.message).join(", "));
                } else {
                    console.error('Error creating student:', err);
                    reject("Unable to create student due to unexpected error");
                }
            });
    });
};

// Function to get a course by ID
module.exports.getCourseById = function(id) {
    return new Promise((resolve, reject) => {
        Course.findAll({
            where: { courseId: id }
        })
        .then(courses => {
            if (courses && courses.length > 0) {
                resolve(courses[0]);
            } else {
                reject("No results returned");
            }
        })
        .catch(err => {
            console.error('Error retrieving course by ID:', err);
            reject("Unable to retrieve course by ID");
        });
    });
};

// Function to update a student
module.exports.updateStudent = function(studentData) {
    return new Promise((resolve, reject) => {
        studentData.TA = studentData.TA ? true : false;
        for (let key in studentData) {
            if (studentData.hasOwnProperty(key) && studentData[key] === "") {
                studentData[key] = null;
            }
        }
        Student.update(studentData, {
            where: { studentNum: studentData.studentNum }
        })
        .then(([affectedRows]) => {
            if (affectedRows > 0) {
                resolve(`Student updated successfully`);
            } else {
                reject("No student updated");
            }
        })
        .catch(err => {
            console.error('Error updating student:', err);
            reject("Unable to update student");
        });
    });
};

// Function to add a new course
module.exports.addCourse = function(courseData) {
    return new Promise((resolve, reject) => {
        for (let prop in courseData) {
            if (courseData[prop] === "") {
                courseData[prop] = null;
            }
        }
        Course.create(courseData)
        .then(course => resolve(course))
        .catch(err => reject("Unable to create course"));
    });
};

// Function to update a course
module.exports.updateCourse = function(courseData) {
    return new Promise((resolve, reject) => {
        for (let prop in courseData) {
            if (courseData[prop] === "") {
                courseData[prop] = null;
            }
        }
        Course.update(courseData, {
            where: { courseId: courseData.courseId }
        })
        .then(() => resolve("Course updated successfully"))
        .catch(err => reject("Unable to update course"));
    });
};

// Function to delete a course by ID
module.exports.deleteCourseById = function(id) {
    return new Promise((resolve, reject) => {
        Course.destroy({
            where: { courseId: id }
        })
        .then(() => resolve("course destroyed successfully")) // Resolve indicating success
        .catch(err => reject("unable to delete course")); // Reject with an error message
    });
};


module.exports.deleteStudentByNum = function(studentNum) {
    return new Promise((resolve, reject) => {
        Student.destroy({
            where: { studentNum: studentNum }
        }).then((deleted) => {
            if (deleted) {
                resolve(`Student ${studentNum} deleted.`);
            } else {
                reject(`Student ${studentNum} not found.`);
            }
        }).catch((err) => {
            reject(`Error deleting student: ${err}`);
        });
    });
};
