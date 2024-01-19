import passport from 'passport';
import LocalStrategy from 'passport-local';
import User from '../models/user.js'

// authentication using passport
passport.use(new LocalStrategy({
    usernameField: 'email',
    passReqToCallback: true
},
    async function (req, email, password, done) {
        // find a user and establish the identity

        try{

            const user = await User.findOne({ email: email });
            if (!user || user.password != password) {
                console.log('Invalid Username/Password');
                req.flash('error', 'Invalid Username/Password');
                return done(null, false);
            }

            return done(null, user);

        }catch(err){
            console.log('Error in finding user --> Passport')
            return done(err);
        }
      
    }
));


// serializing the user to decide which key is to be kept in the cookies
passport.serializeUser(function(user, done){
    done(null, user.id);
});


// deserializing the user from the key in the cookies
passport.deserializeUser(async function(id, done){


    try{
        const user  = await User.findById(id);
        return done(null, user);

    }catch(err){

        console.log('Error in finding user --> Passport');
        return done(err);
    }
});


passport.checkAuthentication= function(req,res,next){
    if(req.isAuthenticated()){

        // req.flash("success", "!");
        return (next());
    }

    return res.redirect('/users/login');
}


passport.setAuthenticatedUser = function(req,res,next){
    if(req.isAuthenticated){
        res.locals.user = req.user;
    }
    next();
}

export default passport;
