/*********************************************************************************
*  WEB700 – Assignment 1
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  
*  No part of this assignment has been copied manually or electronically from any other source
*  (including web sites) or distributed to other students.
* 
*  Name: Jadhusan Mohammed Sadhik Student ID: 155547227 Date: 1/19/2024
*
********************************************************************************/ 


// Utility function to get a random integer between 0 and max (inclusive)
function getRandomInt(max) {
    return Math.floor(Math.random() * (max + 1));
}

// Fill in your own Student Name / Email in the spaces indicated
const studentName = "Jadhusan Mohammed Sadhik";
const studentEmail = "jmohammedsadhik@myseneca.ca";

// Define the arrays with the given data
const serverVerbs = ["GET", "GET", "GET", "POST", "GET", "POST"];
const serverPaths = ["/", "/about", "/contact", "/login", "/panel", "/logout"];
const serverResponses = [
  "Welcome to WEB700 Assignment 1",
  "This assignment was prepared by " + studentName,
  studentName + ": " + studentEmail,
  "User Logged In",
  "Main Panel",
  "Logout Complete"
];

// Define the httpRequest function
function httpRequest(httpVerb, path) {
  // Loop through the server paths array
  for (let i = 0; i < serverPaths.length; i++) {
    // Check if the current index in both serverVerbs and serverPaths matches the given httpVerb and path
    if (serverVerbs[i] === httpVerb && serverPaths[i] === path) {
      // Return the successful response with status code 200
      return `200: ${serverResponses[i]}`;
    }
  }

  // If no match is found, return the error response with status code 404
  return `404: Unable to process ${httpVerb} request for ${path}`;
}

// Define the automateTests function
function automateTests() {
  // Define additional arrays for testing
  const testVerbs = ["GET", "POST"];
  const testPaths = ["/", "/about", "/contact", "/login", "/panel", "/logout", "/randomPath1", "/randomPath2"];

  // Define the randomRequest function
  function randomRequest() {
    // Get random verb and path
    const randVerb = testVerbs[getRandomInt(1)];
    const randPath = testPaths[getRandomInt(7)];

    // Invoke the httpRequest function with random values and log the result
    console.log(httpRequest(randVerb, randPath));
  }

  // Use setInterval to execute randomRequest every 1 second (1000 milliseconds)
  setInterval(randomRequest, 1000);
}

// Call the automateTests function to start automated testing
automateTests();
