import mongoose from "mongoose"

const Schema = mongoose.Schema;
const userSchema = new Schema({
    email: {
        type: String,
        match: [
            /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
          "Please fill a valid email address",
        ],
        required: true,
        minLength: 4,
        unique: true,
      },
      password: {
        type: String,
        match: [/^\S+$/, "Password should not contain spaces"],
        minLength: 4,
        required: true,
      },
      role: {
        type: String,
        default: "user",
      },
      fullName: {
        type: String,
      },
      avatar: {
        type: String,
        default: null,
      }
})

const User = mongoose.model("User", userSchema);

export default User;