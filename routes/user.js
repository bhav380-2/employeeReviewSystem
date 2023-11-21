import express from 'express';
import passport from 'passport';
import UserController from '../controllers/userController.js';
const userController = new UserController();  //creating UserController instance
const userRouter = express.Router();


//get requests
userRouter.get('/login',userController.login);
userRouter.get('/register',userController.register);
userRouter.get('/destroy-session',userController.destroySession);

//post requests
userRouter.post('/create-user',userController.create);
userRouter.post('/create-session',passport.authenticate(
    'local',
    {failureRedirect:'/users/login'}
),userController.createSession);


export default userRouter;