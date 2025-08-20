import { User } from "../models/user.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { inngest } from "../inngest/client.js";


export const signup = async (req, res) => {
    try {
        const { email, password, fullname } = req.body;

        if(!email || !password || !fullname){
            return res.status(400).json({error: "All fields are required"});
        }

        if(password.length < 6){
            return res.status(400).json({error: "Minimum password length should be 6"});
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({error: "Account with this Email already exists"});
        }
        
        const hashedpassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            fullname,
            email,
            password: hashedpassword,
        })

        
        const createdUser = await User.findById(user._id).select("-password");

        if (!createdUser) {
            return res.status(500).json({error: "Something went wrong while registering the user."});
        }

        const token = jwt.sign(
            {_id: user._id },
            process.env.JWT_SECRET,
            {expiresIn: '1d'}
        );

        const options = {
            httpOnly: true,
            secure: true,
            sameSite: 'None',       // 'None' in prod with HTTPS
            expires: new Date(Date.now() + 86400000), // 1 day
        };

        res.cookie("token", token, options);
        return res.status(200).json({message: "Account created.", user: createdUser, token});

    } catch (error) {
        console.log(error.message);
        res.status(500).json({message: "Internal server error", error: error.message});
    }
}




export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if(!email || !password){
            return res.status(400).json({error: "Email or Password is not entered"});
        }

        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({error: "Account doesn't exists"});
        }
        
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(401).json({error: "Invalid credentials"})
        }

        const createdUser = await User.findById(user._id).select("-password");

        if (!createdUser) {
            return res.status(500).json({error: "Something went wrong while Logging in"});
        }


        const token = jwt.sign(
            {_id: user._id, role: user.role },
            process.env.JWT_SECRET,
            {expiresIn: '1d'}
        );

        const options = {
            httpOnly: true,
            secure: true,
            sameSite: 'None',       // 'None' in prod with HTTPS
            expires: new Date(Date.now() + 86400000), // 1 day
        };
        res.cookie("token", token, options);
        return res.status(200).json({message: "User Logged in", user: createdUser, token});

    } catch (error) {
        console.log(error.message);
        res.status(500).json({message: "Internal server error", error: error.message});
    }
}




export const logout = async (req, res) => {
    try{
        res.clearCookie('token');
        res.status(200).json({message: "Logged out successfully"});
    }catch(error){
        console.log(error);
        res.status(500).json({message: "Internal server error", error: error.message});
    }
}



export const checkauth = async (req, res) => {
    try{
        const user = await User.findById(req.user._id);
        const token = req.cookies?.token;
        return res.status(200).json({message: "User Logged in", user, token});
    } catch (error){
        console.log(error);
        res.status(500).json({message: "Internal server error", error: error.message});
    }
}




export const sendOtpController = async (req, res) => {
  const { email } = req.body;

  try {
    if (!email){
        return res.status(400).json({ error: "Email is required" });
    }

    const user = await User.findOne({ email });
    if (!user){
        return res.status(404).json({ error: "Invalid Email" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP

    // Trigger Inngest OTP function
    await inngest.send({
      name: "otp/request",
      data: {
        userId: user._id.toString(),
        email,
        otp,
      },
    });

    res.status(200).json({ message: "OTP will be sent shortly" });
  } catch (error) {
    console.error("Error in sendOtpController:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};





export const resetPassword = async (req, res) => {
  try {
    const { otp, newPassword, email } = req.body;

    if (!otp || !newPassword || !email) {
      return res.status(400).json({ error: "Email, OTP, and new password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "Invalid Email" });
    }

    if (!user.otp || !user.otpExpiry) {
      return res.status(400).json({ error: "No OTP found. Please request again." });
    }

    if (Date.now() > user.otpExpiry) {
      return res.status(400).json({ error: "OTP has expired. Please request a new one." });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ error: "Invalid OTP" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.otp = undefined;
    user.otpExpiry = undefined;

    await user.save();

    return res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.error("Error in resetPassword:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};




export const EditInfo = async (req, res) => {
  try {
    const { fullname, email } = req.body;
    const userId = req.user._id; // assuming userId is set from auth middleware

    if (!fullname || !email) {
      return res.status(400).json({ error: "Full name and email are required" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    user.fullname = fullname;
    user.email = email;

    await user.save();

    return res.status(200).json({
      message: "User info updated successfully",
      user: {
        fullname: user.fullname,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Error in edit info:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
