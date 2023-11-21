import express from 'express';
import passport from 'passport';

import userRouter from './user.js';
import adminRouter from './admin.js';
import employeeRouter from './employee.js';
import checkAdminMiddleware from '../config/checkAdminMiddleware.js'

const indexRouter = express.Router();

indexRouter.get('/',passport.checkAuthentication,checkAdminMiddleware)  //using checkAdminMiddleware to redirect user to admin or employee page on basis of access permission

indexRouter.use('/users',userRouter);     // handles logging in and signing up of user 
indexRouter.use('/admin',passport.checkAuthentication,adminRouter) //handles admin related requests
indexRouter.use('/employee',passport.checkAuthentication,employeeRouter) //handles employees requests

export default indexRouter;