import express from 'express';
import passport from 'passport';

import EmployeeController from '../controllers/employeeController.js'; 
const employeeController = new EmployeeController(); //creating instance of Employee controller

const employeeRouter = express.Router();

employeeRouter.get('/',employeeController.home);
employeeRouter.post('/review/:id',passport.checkAuthentication,employeeController.review);


export default employeeRouter;