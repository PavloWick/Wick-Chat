import bcrypt from "bcryptjs/dist/bcrypt.js";
import User from "../models/user.model.js";
import generateTokenAndSetCookie from "../utils/generateToken.js";

export const signup = async (req,res) => {
    try{
        const {fullName,username,password,confirmPassword,gender} = req.body;
        
        if(password !== confirmPassword) {
            return res.status(400).json({error: "Passwords don't match"});
        }
        const user = await User.findOne({username});

        if(user) {
            return res.status(400).json({error: "Username already exists"});
        }

        // Hash pass here
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);


        const boyProfilepic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
        const girlProfilepic = `https://avatar.iran.liara.run/public/girl?username=${username}`;
    
        const newUser = new User ({
            fullName,
            username,
            password : hashPassword,
            gender,
            profilePic: gender === "male" ? boyProfilepic : girlProfilepic
        })

        if (newUser) {
            generateTokenAndSetCookie(newUser._id, res);
            await newUser.save(); // SAVE USER TO DB
            res.status(201).json({
                _id: newUser.id,
                fullName: newUser.fullName,
                username: newUser.username,
                profilePic: newUser.profilePic,
                gender: newUser.gender
            });
    } else {
        res.status(400).json({ error: "Invalid user data" });
    }


    } catch(error) {
        //console.log(`Error in signup controller ${error.message}`);
        res.status(500).json({error: "Internal Server Error"})
    }
}


export const login = async (req,res) => {
    try {
        const {username,password} = req.body;
        const user = await User.findOne({username});
        const isPassCorrect = await bcrypt.compare(password, user?.password || "");

        if (!user || !isPassCorrect) {
            return res.status(400).json({ error: `Invalid username (${user.username}) or password (${user.password})` });
        }

        generateTokenAndSetCookie(user._id, res);
        res.status(201).json({
            _id: user._id,
            fullName: user.fullName,
            username: user.username,
            profilePic: user.profilePic,
            gender: user.gender
        });

    }catch(error){

        res.status(500).json({error: "Internal Server Error"})
    }
}

export const logout = (req,res) => {
    try{
        res.cookie("jwt","",{maxAge: 0});
        res.status(200).json({message: "Logged out succesfully"});
    }catch(error){
        res.status(500).json({error: "Internal Server Error"})
    }
}