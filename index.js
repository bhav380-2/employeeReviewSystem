import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import passport from 'passport';
import passportLocal from './config/passport-local-strategy.js';
import expressEjsLayouts from 'express-ejs-layouts';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import cookieParser from 'cookie-parser';
import ejs from 'ejs';
import flash from 'connect-flash';



import indexRouter from './routes/index.js';
import db from './config/mongoose.js';
import { setFlash } from './config/flashMiddleware.js';


// ____________express server_____________
const app = express();
const port = 7000;

app.use(express.urlencoded({extended:false}));  // parses form data
app.use(cookieParser());     //cookie parser

app.use(express.static('assets')); // specifying static files (css,js,img) folder 


//_________setting up view engine_________
app.set('view engine', 'ejs');
app.set('views', './views');


app.use(expressEjsLayouts);

// extracts style and scripts from sub pages into the layout
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);

app.use(express.static('views'));  //specifying views(ejs) folder


// using express session
app.use(session({
    name : 'employeeReviewSystem',
    secret : 'hi',
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: (1000 * 60 * 100)
    },

    store : MongoStore.create({          //storing user session in db
            mongoUrl: 'mongodb://localhost/employeeReviewSystem',
            autoRemove: 'disabled'
        },
        function(err){
            console.log(err || 'connect-Mongodb store ok');
            return;
        }
    )
}));



// __________passport.js for authentication_______
app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser);

//__________using flash messages__________
app.use(flash());
app.use(setFlash);




// _______use express router (every req is directed to indexRouter)_________________
app.use('/',indexRouter);




//_________firing express server____________________
app.listen(port,(err)=>{
    if(err){
        console.log('Error connecting to port',port);
    }
    console.log('Successfully connected to port ',port);
})