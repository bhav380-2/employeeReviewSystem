
//discards unauthorized access to admin
export default function isUnauthorized(req,res,next){

    if(!req.user || req.user.access!='admin'){
        return res.send('Unauthorized access !!!');
    }

    next();
}