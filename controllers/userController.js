import User from '../models/user.js'

export default class UserController {

    // _________________________________login_______________________________________
    login(req, res) {

        if (req.isAuthenticated()) {
            return res.redirect('/');
        }

        return res.render('login', {
            title: 'Log In'
        })
    }

    // ____________________________register employee_______________________________
    register(req, res) {
        if (req.isAuthenticated()) {
            return res.redirect('/users/profile');
        }

        return res.render('register', {
            title: "Employee Registration",
            Message: ""
        })
    }

    // _______________________________create_________________________________________
    async create(req, res) {

        try {

            if (req.body.password != req.body.confirm_password) {

                req.flash("error", "Passwords doesn't match!!!");
                return res.redirect('back');
            }
            const user = await User.findOne({ email: req.body.email });

            if (!user) {   // if no user is registered with provided email, create new user
                const password = req.body.password;
                const name = req.body.name;
                const email = req.body.email;
                const access = 'user';
                const newUser = await User.create({
                    name: name,
                    email: email,
                    password: password,
                    access: access
                });

                req.flash("success", "Account registered!!!");
                return res.redirect('/users/login');
            } else {  // email already registered

                req.flash("error", "user already registered!!!");
                return res.redirect('back');
            }

        } catch (err) {
            console.log('Error in creating new user : ', err);
            return;
        }
    }

    // _______________________________________create session________________________________
    async createSession(req, res) {

        req.flash('success','logged in')
        return res.redirect('/');
    }

    // ______________________________________destroy session________________________________
    async destroySession(req, res,next) {


        if (req.isAuthenticated()) {

            req.logout(function (err) {
                if (err) {
                    return next(err);
                }

                req.flash("success","Signed out!");
                return res.redirect('/users/login')
            })
        }
    }
}