import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true,
    },

    gender:{
        type:String,
        enum:["Male","Female"],
        // required:true
    },
    password: {
        type: String,
        required: true
    },

    access: {
        type: String,
        enum: ['admin', 'user'],
    },

    reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Review'
        }
    ],

    toReview : [
        {
            type:mongoose.Schema.Types.ObjectId,
            ref : 'User'
        }
    ]

}, {
    timestamps: true
});

const User = mongoose.model('User', userSchema);

export default User;