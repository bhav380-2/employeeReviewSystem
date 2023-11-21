import express from 'express';
// import passport from 'passport';

import isUnauthorized from '../config/unAuthorizedAccess.js';  //used to discard unauthorized access
import AdminController from '../controllers/adminController.js';
const adminController = new AdminController();  //creating instance of AdminController

const adminRouter = express.Router();


// get requests
adminRouter.get('/',isUnauthorized,adminController.home);
adminRouter.get('/emp-reviews/:id',isUnauthorized,adminController.seeReviews);


//post requests
adminRouter.post('/assign-review-task',isUnauthorized,adminController.assignReviewTask);
adminRouter.post('/add-employee',isUnauthorized,adminController.addEmployee);
adminRouter.post('/add-employee-review/:id',isUnauthorized,adminController.addEmployeeReview);

//put requests
adminRouter.put('/save-updated-review/:id',isUnauthorized,adminController.saveUpdatedReview);
adminRouter.put('/update-employee/:id',isUnauthorized,adminController.updateEmployee);

//delete requests
adminRouter.delete('/remove-employee/:id',isUnauthorized,adminController.removeEmployee);
adminRouter.delete('/delete-review/:id',isUnauthorized,adminController.deleteReview); 


export default adminRouter;