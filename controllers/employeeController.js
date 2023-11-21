import User from '../models/user.js'
import Review from '../models/reviews.js';

export default class EmployeeController {


    //  _____________________________employees home page_________________________________
    async home(req, res) {

        if(req.user.access=='admin'){
            res.redirect('/admin');
        }

        const employee = await User.findOne({_id:req.user.id}).populate({path:'toReview',select:'-password'});

        return res.render('employee', {
            Title: 'Employee page',
            ToReview : employee.toReview    // contains info of employees to be reviewed 
        });
    }

    // _______________________________review__________________________________________
    async review(req, res) {

        try{
            const employee = await User.findById(req.params.id);
            if(employee){  //if employee found

                // create new Review
                const newReview = await Review.create({
                    employee:employee.id,
                    reviewBy:req.user.id,
                    review:req.body.review
                })
                
                //insert Review
                employee.reviews.push(newReview.id);
                employee.save();

                //remove id of reviewed employee from toReview array of reviewer employee
                const reviewer = await User.findById(req.user.id);
                reviewer.toReview.pull(employee.id);
                reviewer.save();


                if(req.xhr){   //handle ajax req
                    return res.status(201).json({
                        message:'review sent!!!'
                    })
                }else{
                    req.flash('success','review sent')
                    return res.redirect('back');
                }


            }else{
                return res.status(404).send('Employee not Found');
            }

        }catch(err){
            console.log("Error in reviewing employee :: ",err);
            return;
        }
    }
}