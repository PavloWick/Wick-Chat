import User from "../models/user.model.js";

export const getUsersForSidebar = async(req,res) => {
    try {

        const loggedInUserId = req.user._id;
        // find everyone except loggedInUserId, thats what the $ne is for
        const filteredUsers = await User.find({_id: { $ne: loggedInUserId }}).select("-password");
        
        res.status(200).json(filteredUsers);

    } catch(error) {
        process.stdout.write("Error in getUsersForSidebar: ", error.message);
      res.status(500).json({error: 'Internal server error'});
    }
}