import mongoose, { mongo } from 'mongoose';

const reviewSchema = new mongoose.Schema({

    employee : {
        type: mongoose.Schema.Types.ObjectId,
        ref:'User',
    },
    reviewBy : {
        type: mongoose.Schema.Types.ObjectId,
        ref:'User',
    },

    review : {
        type:String,
        required:true
    }

}, {
    timestamps: true
});

const Review = mongoose.model('Review', reviewSchema);
export default Review;