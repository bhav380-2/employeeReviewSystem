# EmployeeReveiwSystem



## Overview

This web application serves as an Employee Review System, allowing administrators to manage employees, conduct performance reviews, and facilitate feedback. Employees can access their performance reviews, submit feedback, and view a list of pending reviews.


## Features

### Admin View


![Admin page](/assets/readmeScreenShots/adminHome.png)


1. **Assign Employees for Feedback:**
   - Admins can assign employees to participate in another employee's performance review, facilitating a 360-degree feedback process.

2. **Add/Remove/Update/View Employees:**
   - *Add Employee:* Admins can add new employees to the system, providing necessary details such as name, position, and contact information.
   - *Remove Employee:* Admins have the ability to remove employees from the system, updating the employee roster as needed.
   - *Update Employee Details:* Admins can modify employee information, ensuring that the system reflects the most current data.
   - *View Employee List:* Admins can view a comprehensive list of all employees in the system.


<br>
<br>

![View employees admin](/assets/readmeScreenShots/viewEmployeesAdmin.png)

<br>
<br>
<br>



3. **Add/Update/View Performance Reviews:**
   - *Add Performance Review:* Admins can initiate performance reviews for employees, specifying the review period and relevant details.
   - *Update Performance Review:* Admins have the ability to modify existing performance reviews, allowing for adjustments to the review criteria or period.
   - *View Performance Reviews:* Admins can access a list of all performance reviews, organized by employee 

<br>
<br>

![Reviews page](/assets/readmeScreenShots/reviews.png)


<br>
<br>
<br>


4. **Employee Role Management:**
   - *Grant Admin Privileges:* Only admins can elevate an employee to an admin role, granting them access to administrative features.

### Employee View


![Employee page](/assets/readmeScreenShots/reviewColleouges.png)


1. **List of Performance Reviews Requiring Feedback:**
   - Employees can view a list of their pending performance reviews that require feedback, enabling them to prioritize their tasks.

2. **Submit Feedback:**
   - Employees can submit feedback for performance reviews assigned to them, providing valuable insights into their colleagues' work.

## Authentication

1. **Single Login for Admin and Employee:**
   - The system provides a single, secure login interface for both administrators and employees.

2. **Admin-Only Privilege:**
   - Admin privileges are reserved for individuals explicitly designated as admins by the system. Regular employees do not have the authority to grant admin status.

## Folder Structure

The project follows a structured organization to ensure modularity and maintainability. Here's a brief overview of the main folders:

- **assets:** Contains static files like CSS, images and client-side JavaScript.

- **controllers:** Handles the application's business logic.


- **routes:** Defines the routes and their corresponding controller actions.
   - **index.js** file: Redirects requests to specific routes (adminRoute,employeeRoute or userRoute)
   - **admin.js** file: Handles all admin requests
   - **employee.js** file: Handles all requests sent by employee.
   - **user.js** file: Handles logging in, signing up, signing out user

- **config:** Houses utility functions and configuration files.

- **models:** contains files specifying models schema

- **views:** Contains .ejs files

- **index.js:** file : server file



## Getting Started

To run the Employee Review System web app locally, follow these steps:

1. Clone the repository:
   ```bash
   git clone https://github.com/bhav380-2/employeeReviewSystem.git

2. Install dependencies:
   ```bash

   cd /path-to-repository/employeeReviewSystem
   npm install

3. Run the application:
   ```bash
   npm start

4. Access the application in your browser at http://localhost:7000


<br>
<br>


 We welcome contributions from the community and appreciate your support in making this project better.
