import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import genToken from "../config/token.js";

export const signUp = async (req, res) => {
  try {
    const { userName, email, password } = req.body;
    const checkByUserName = await User.findOne({ userName });
    if (checkByUserName) {
      return res.status(400).json({ message: "UserName already exists" });
    }

    const checkByEmail = await User.findOne({ email });
    if (checkByEmail) {
      return res.status(400).json({ message: "Email already exists" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "password must be at least 6 characters long " });
    }

    const passwordHash = await bcrypt.hash(password, 10);

     const user = await User.create({
    userName,
    email,
    password: passwordHash
   })

    const token=await genToken(user._id);

    res.cookie("token",token,{
        httpOnly:true,
        maxAge:7*24*60*60*1000,
        sameSite:"None",
        secure:false
    })

  return res.status(201).json({user})
;
  } catch (error) {

    return res.status(500).json({message:`Internal server error ${error.message }`});
  }
};



export const login = async (req,res)=>{
  try {
    const {email,password}=req.body;
    const user=await User.findOne({email});
    if(!user){
      return res.status(400).json({message:"Invalid email or Password"});
    }
    const isMatch= await bcrypt.compare(password,user.password);
    if(!isMatch){
      return res.status(400).json({message:"Invalid email or Password"});
    }

    const token=await genToken(user._id);
    res.cookie("token",token,{
      httpOnly:true,
      maxAge:7*24*60*60*1000,
      sameSite:"None",
      secure:false
    })

    return res.status(200).json({user, message:"Login Successful"});
  
  } catch (error) {
    return res.status(500).json({message:`Login failed. Internal server error ${error.message}`});
  }
}


export const logOut=async(req,res)=>{
  try {
    res.clearCookie("token");
    return res.status(200).json({message:"Logged out sucessfully"});
  } catch (error) {
    return res.status(500).json({message:`Logout failed. Internal server error ${error.message}`});
  }
}