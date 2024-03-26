const fs = require("fs");

class Data{
    constructor(students, courses){
        this.students = students;
        this.courses = courses;
    }
}

let dataCollection = null;

module.exports.initialize = function () {
    return new Promise( (resolve, reject) => {
        fs.readFile('./data/courses.json','utf8', (err, courseData) => {
            if (err) {
                reject("unable to load courses"); return;
            }

            fs.readFile('./data/students.json','utf8', (err, studentData) => {
                if (err) {
                    reject("unable to load students"); return;
                }

                dataCollection = new Data(JSON.parse(studentData), JSON.parse(courseData));
                resolve();
            });
        });
    });
}

module.exports.getAllStudents = function(){
    return new Promise((resolve,reject)=>{
        if (dataCollection.students.length == 0) {
            reject("query returned 0 results"); return;
        }

        resolve(dataCollection.students);
    })
}

module.exports.getTAs = function () {
    return new Promise(function (resolve, reject) {
        var filteredStudents = [];

        for (let i = 0; i < dataCollection.students.length; i++) {
            if (dataCollection.students[i].TA == true) {
                filteredStudents.push(dataCollection.students[i]);
            }
        }

        if (filteredStudents.length == 0) {
            reject("query returned 0 results"); return;
        }

        resolve(filteredStudents);
    });
};

module.exports.getCourses = function(){
   return new Promise((resolve,reject)=>{
    if (dataCollection.courses.length == 0) {
        reject("query returned 0 results"); return;
    }

    resolve(dataCollection.courses);
   });
};

module.exports.getStudentByNum = function (num) {
    return new Promise(function (resolve, reject) {
        var foundStudent = null;

        for (let i = 0; i < dataCollection.students.length; i++) {
            if (dataCollection.students[i].studentNum == num) {
                foundStudent = dataCollection.students[i];
            }
        }

        if (!foundStudent) {
            reject("query returned 0 results"); return;
        }

        resolve(foundStudent);
    });
};

module.exports.getStudentsByCourse = function (course) {
    return new Promise(function (resolve, reject) {
        var filteredStudents = [];

        for (let i = 0; i < dataCollection.students.length; i++) {
            if (dataCollection.students[i].course == course) {
                filteredStudents.push(dataCollection.students[i]);
            }
        }

        if (filteredStudents.length == 0) {
            reject("query returned 0 results"); return;
        }

        resolve(filteredStudents);
    });
};

module.exports.addStudent = function (studentData) {
    return new Promise((resolve, reject) => {
        // Set TA flag based on studentData.TA value
        studentData.TA = studentData.TA ? true : false;
        
        // Set the studentNum property
        studentData.studentNum = dataCollection.students.length + 1;
        
        // Push the updated studentData to the students array
        dataCollection.students.push(studentData);
        
        resolve();
    });
}


// Define the function getCourseById within the module.exports object
module.exports.getCourseById = function(id) {
    // This function will provide the "course" object whose course id matches the input using the resolve method of the returned promise. 
    // If the course id does not exist, display error message.

    return new Promise(function(resolve, reject) {
        // Find the course with the course id matching the input:
        for (const singleCourse of dataCollection.courses) {
            if(singleCourse.courseId == id){
                resolve(singleCourse);
                return; // Ensure that the function exits after resolving a course
            }
        }
        reject("Error: No results returned");
    });
};



// module.exports.updateStudent = function(studentData) {
//     return new Promise((resolve, reject) => {
//         // Update logic for the student using studentData
//         resolve();
//     });
// };

module.exports.updateStudent = function(studentData) {
    return new Promise((resolve, reject) => {
        // Find the student with the matching studentNum
        let student = dataCollection.students.find(s => s.studentNum == studentData.studentNum);
        if (student) {
            // Update the student's properties
            student.firstName = studentData.firstName || student.firstName;
            student.lastName = studentData.lastName || student.lastName;
            student.email = studentData.email || student.email;
            student.addressStreet = studentData.addressStreet || student.addressStreet;
            student.addressCity = studentData.addressCity || student.addressCity;
            student.addressProvince = studentData.addressProvince || student.addressProvince;
            student.TA = studentData.TA === "on"; // Check if the checkbox was checked
            student.course = studentData.course || student.course;
            student.status = studentData.status || student.status;
            
            // Write the updated students array to the students.json file
            fs.writeFile('./data/students.json', JSON.stringify(dataCollection.students), err => {
                if (err) {
                    reject('Unable to save student update.');
                } else {
                    resolve();
                }
            });
        } else {
            reject('Student not found');
        }
    });
};