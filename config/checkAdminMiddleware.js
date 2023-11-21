// import User from '../models/user.js'


// _______________redirects user to admin page if user's access is admin______________________
let checkAdmin = async function(req, res,next) {

    if(res.locals.flash.success.length>0){
        req.flash('success','Logged in !!!')
    }

    if (req.user && req.user.access == 'admin') {

        console.log(res.locals.flash);
        return res.redirect('/admin')

    }else{
        return res.redirect('/employee');
    }
}

export default checkAdmin;