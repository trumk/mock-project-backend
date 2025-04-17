import User from '../models/User.model.js'

const userController = {
    getProfile: async (req, res) => {
        try {
            const id = req.params.id;
            const userId = req.user.id
            if (id !== userId) {
                return res.status(403).json({ message: "You can only view your own profile" });
            }
            const user = await User.findById(id);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            return res.status(200).json(user);
        } catch (error) {
            return res.status(500).json(error);
        }
    },
    editProfile: async (req, res) => {
        try {
            const id = req.params.id;
            const userId = req.user.id;
            if (id !== userId) {
                return res.status(403).json({ message: "You can only view your own profile" });
            }
            const {fullName, avatar, nickName, birth, gender, nationality, phone} = req.body;
            const updatedUser = await User.findByIdAndUpdate(id, {fullName, avatar, nickName, birth, gender, nationality, phone}, { new: true, runValidators: true })
            if (!updatedUser) {
                return res.status(404).json({ message: "User not found" });
            }
            return res.status(200).json(updatedUser);
        } catch (error) {
            return res.status(500).json(error);
        }
    }
}

export default userController;