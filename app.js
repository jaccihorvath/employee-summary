const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");


// Validate user input
function validateInput(value) {
    if (value) {
        return true;
    } else {
        return "Please enter a valid input."
    }
};



// Prompt user
let team = [];

const questions = () => {
    return inquirer.prompt([
        {
            type: "input",
            name: "name",
            message: "Please enter the employee's name:",
            validate: validateInput
        },
        {
            type: "input",
            name: "email",
            message: "Please enter the employee's email:",
            validate: validateInput
        },
        {
            type: "input",
            name: "id",
            message: "Please enter the employee's id number:",
            validate: validateInput
        },
        {
            type: "list",
            name: "role",
            message: "Please select the employee's role:",
            choices: ["Manager", "Engineer", "Intern"]
        },
        {
            type: "input",
            name: "school",
            message: "Which school is your intern attending?",
            when: (answers) => answers.role === "Intern",
            validate: validateInput
        },
        {
            type: "input",
            name: "github",
            message: "Please provide the engineer's GitHub username:",
            when: (answers) => answers.role === "Engineer",
            validate: validateInput
        },
        {
            type: "input",
            name: "office",
            message: "Please provide the manager's office number:",
            when: (answers) => answers.role === "Manager",
            validate: validateInput
        },
        {
            type: "confirm",
            name: "add",
            message: "Would you like to add another employee?"
        },
    ]).then((answers) => {
            // Handle cases for adding new employees
            switch (answers.role) {
                case "Manager":
                    let newManager = new Manager(
                        answers.name, 
                        answers.id, 
                        answers.email, 
                        answers.office
                        );

                        team.push(newManager);

                    break;
    
                case "Engineer":
                    let newEngineer = new Engineer(
                        answers.name, 
                        answers.id, 
                        answers.email, 
                        answers.github
                        );

                        team.push(newEngineer);

                    break;
    
                case "Intern":
                    let newIntern = new Intern(
                        answers.name, 
                        answers.id, 
                        answers.email, 
                        answers.school
                        );

                        team.push(newIntern);

                    break;
            }
            // Check to see if the user wants to add additional employees
            if (answers.add === true) {
                return questions()
            } else {
            buildTeam();
            console.log("Success! Your team has been built.")
            }
        
    })
};

// Render employees to html file
const buildTeam = () => {
    fs.writeFileSync(outputPath, render(team));
};

// Start application
questions();