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
    default: null,
  },
  avatar: {
    type: String,
    default: null,
  },
  nickName: {
    type: String,
    default: null
  },
  birth: {
    type: Date,
    default: null
  },
  gender:{
    type: String,
    default: null
  },
  nationality:{
    type: String,
    default: null
  },
  phone:{
    type: String,
    default: null
  },
  token: {
    type: String,
    default: null
  },
  createdAt: {
    type: Date
  },
  updatedAt: {
    type: Date
  }
})

const User = mongoose.model("User", userSchema);

export default User;
