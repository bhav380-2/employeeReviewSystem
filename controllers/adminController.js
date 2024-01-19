import User from '../models/user.js';
import Review from '../models/reviews.js';

export default class AdminController {

    // __________________________________admin home page_________________________________________
    async home(req, res) {

        try {

            const employees = await User.find({ access: 'user' }).select('-password');
            return res.render('admin', {
                Title: 'admin page',
                Employees: employees
            })

        } catch (err) {
            console.log('error in admin home page ::: ', err);
            return;
        }
    }

    // ____________________________________assign review_______________________________________
    async assignReviewTask(req, res) {
        try {

            if (req.body.reviewer_email == req.body.emp_email) {   //if reviewer and reviewee email are same

                if (req.xhr) {                         //handling ajax request
                    return res.status(400).json({
                        message: "email's can't be same!!!"
                    })
                }else{

                    req.flash('error', "email's can't be same!!!");
                    return res.redirect('back');
                }
            }

            const reviewer = await User.findOne({ email: req.body.reviewer_email }).select('-password');
            const employee = await User.findOne({ email: req.body.emp_email }).select('-password');

            // _________handling Invalid email input_ ________
            if (employee == null || reviewer == null) {
                if (req.xhr) {                     //handling ajax request

                    return res.status(404).json({

                        message: "email not found !!!"
                    });
                }else{

                    req.flash('error', 'email not found!!!');
                    return res.redirect('back');
                }
            }

<<<<<<< HEAD
           // returns if reivew is already assigned to reviewer
            for(let toReviewid of reviewer.toReview){
=======
             // returns if reivew is already assigned to this reviewer
            for(let toReviewid of reviewer.toReview){

                console.log("hi");

>>>>>>> a4bdaba (adding env file and changes in package.json script)
                
                if(toReviewid==employee.id){
                    return res.status(400).json({
                        message:"review already assigned!!!"
                    })
                }
            }

            // pushing reviewee id in reveiwer's toReview array
            reviewer.toReview.push(employee._id);
            reviewer.save();


            if (req.xhr) {    // if ajax request
                return res.status(201).json({
                    message: "review assigned!!!"
                })
            }else{

                req.flash('success', 'review assigned')
                return res.redirect('back');
            }

        } catch (err) {
            console.log('Error in assigning review task :::::::::::: ', err);
        }
    }

    // ____________________________________add employee_____________________________________________
    async addEmployee(req, res) {

        try {

            // ______________if passwords doesn't match______________
            if (req.body.password != req.body.confirm_password) {

                if (req.xhr) {
                    return res.status(400).json({
                        message: "Enter same passwords!!!"
                    })
                }else{

                    req.flash('error', 'Enter same passwords!!!')
                    return res.redirect('back');
                }
             
            }
            const user = await User.findOne({ email: req.body.email });  // 

            if (!user) {          //create new user if no user is registered with provided email           
                const password = req.body.password;
                const name = req.body.name;
                const email = req.body.email;
                const gender = req.body.gender
                const access = 'user';
                const newUser = await User.create({
                    name: name,
                    email: email,
                    gender: gender,
                    password: password,
                    access: access
                });

                if (req.xhr) {                    // handling ajax request
                    return res.json(201, {
                        data: {
                            employee: {
                                name: newUser.name,
                                email: newUser.email,
                                gender: newUser.gender,
                                id: newUser.id

                            }
                        },
                        message: "employee added!!!"
                    })
                }else{
                    req.flash('success', 'employee added');
                    return res.redirect('back');
                }

            } else {  // email  already registered

                if (req.xhr) {
                    return res.status(400).json({
                        message: 'email already registered!!!'
                    });

                }else{

                    req.flash('error', 'email already registered!!!')
                    return res.redirect('back');
                }
            }

        } catch (err) {
            console.log('Error in creating new user : ', err);
            return;
        }
    }

    // _________________________________update employee___________________________________
    async updateEmployee(req, res) {

        try {

            const user = await User.findById({ _id: req.params.id });

            if (user.email != req.body.email) {   //if email is to be changed

                const existingUser = await User.findOne({ email: req.body.email });
                if (existingUser) {        // check if new provided email is already registered with another user

                    if (req.xhr) {          // handle ajax request
                        return res.status(400).json({
                            data: {
                                email: user.email
                            },
                            message: 'email already registered !!!'
                        })
                    }else{

                        req.flash('error', 'email already registered!!!');
                        return res.redirect('/');
                    }
                }
            }

            //else update employee
            user.email = req.body.email;
            user.name = req.body.name;
            user.gender = req.body.gender;

            if (req.body.access == 'admin') {  // if access is changed to admin
                user.access = 'admin';
            } else {
                user.access = 'user';
            }

            user.save(); 

            if (req.xhr) {        //handle ajax req
                return res.status(201).json({
                    message: "employee updated successfully"
                })
            }else{

                req.flash('success', 'employee updated');
                return res.redirect('back');
            }
           
        } catch (err) {
            console.log('error while updating employee :: ', err);
            return;
        }
    }

    // _________________________________________remove employee_______________________________
    async removeEmployee(req, res) {

        try {


            const employee= await User.findById(req.params.id);  //find employee to be deleted

            const empReviews = employee.reviews;

            for(let reviewId of empReviews){
                await Review.findByIdAndDelete(reviewId);
            }

            employee.deleteOne();


            if (req.xhr) {   // handle ajax req
                return res.status(200).json({
                    message: "employee deleted"
                })
            }else{

                req.flash('success', 'employee removed')
                return res.redirect('/admin');
            }

        } catch (error) {
            console.log("Error in removing employee :: ", error);
            return;
        }
    }

    // _______________________________________see reviews of an employee_____________________________
    async seeReviews(req, res) {

        const employee = await User.findById(req.params.id).select('-password').populate({ path: 'reviews', populate: { path: 'reviewBy', select: '-password' } }).sort({'updatedAt':-1});

        return res.render('reviews', {
            Employee: employee
        })
    }

    // _______________________________________add employee employee_________________________________
    async addEmployeeReview(req, res) {

        try {

            //these variables are passed in json data to client if req is ajax
            let message = "";     
            let review = null;
            let isNewlyAdded= false;

            const existingReview = await Review.findOne({ employee: req.params.id, reviewBy: req.user.id });
            
            if (existingReview) {    //if employee is already reviewed by reviewer update previous review 
                existingReview.review = req.body.review;

                console.log(existingReview);
                existingReview.save();
                message = "previous review updated!!!";
                review = existingReview;

            } else {              // else create new review

               let newReview = await Review.create({
                    employee: req.params.id,
                    reviewBy: req.user.id,
                    review: req.body.review
                });

                await newReview.populate({path:'reviewBy',select:'name email id'});

                const employee = await User.findById(req.params.id);  // finding reviewed employee
                employee.reviews.push(newReview.id);             //pushing review id in employee's reviews array
                employee.save();                               //saving changes

                isNewlyAdded = true;            // passed as json data if req is ajax , used for dom manipulation
                review = newReview;             // passed as json data if req is ajax , used for creating new dom element

                message = 'review added!!!';   // used to show notification

            }

            if (req.xhr) {                // if ajax req
                return res.status(201).json({
                    data: {
                        review:review,
                        isNewReview:isNewlyAdded
                    },
                    message: message
                });

            }else{

                req.flash('success', message)
                return res.redirect('back');
            }
        

        } catch (err) {
            console.log("error in adding employee review ::: ", err);
            return;
        }
    }

    // ____________________________________save updated review__________________________________________
    async saveUpdatedReview(req, res) {

        try {
            const review = await Review.findById(req.params.id);  // finding review by review id
            review.review = req.body.review_text;           // updating review text
            review.save();                              // saving changes

            if (req.xhr) {        //ajax req
                return res.status(201).json({
                    message: "review updated!!!"
                })
            }else{

                req.flash('success', 'review updated')
                return res.redirect('back');
            }

        } catch (err) {
            console.log('error in updating review :: ', err);
            return;
        }
    }

    //  _________________________________deleting review____________________________________________________
    async deleteReview(req, res) {

        try {
            const review = await Review.findOne({ _id: req.params.id });  //finding review

            const empId = review.employee;                  // storing empId of employee to whom review belongs
            const employee = await User.findById(empId);    //finding employee using empId
            
            employee.reviews.pull(review.id);              // removing review id from employee reviews array
            review.deleteOne();                       // deleting review
          
            if (req.xhr) {                              //handling ajax req
                return res.status(200).json({
                    data: {
                        reviewId:req.params.id
                    },
                    message: "review deleted !!!"
                })
            }else{
                req.flash('success', 'review deleted')
                return res.redirect('back');
            }

        } catch (err) {
            console.log('error in deleting review : ', err);
            return;
        }
    }
}
