import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
        min: 6,
    },
    otp: {
        type: String
    },
    otpExpiry: {
        type: Date
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
})


export const User = mongoose.model('User', userSchema);