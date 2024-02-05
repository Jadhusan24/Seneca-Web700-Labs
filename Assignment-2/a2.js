/*********************************************************************************
/*********************************************************************************
*  WEB700 – Assignment 1
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  
*  No part of this assignment has been copied manually or electronically from any other source
*  (including web sites) or distributed to other students.
* 
*  Name: Jadhusan Mohammed Sadhik Student ID: 155547227 Date: 1/2/2024
*
********************************************************************************/ 

const collegeData = require('./modules/collegeData');

async function initializeCollegeData() {
    try {
        await collegeData.initialize();
        console.log("Initialization successful.");

        // Retrieve data after successful initialization
        const students = await collegeData.getAllStudents();
        console.log(`Successfully retrieved ${students.length} students`);

        const courses = await collegeData.getCourses();
        console.log(`Successfully retrieved ${courses.length} courses`);

        const tas = await collegeData.getTAs();
        console.log(`Successfully retrieved ${tas.length} TAs`);
    } catch (error) {
        console.error("Initialization failed:", error);
    }
}

initializeCollegeData();
