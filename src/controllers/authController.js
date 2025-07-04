import User from '../models/User.model.js'
import bcrypt from "bcrypt";
import { generateAccessToken, generateRefreshToken } from '../middlewares/JWT.js'
import admin from '../middlewares/firebaseAdmin.js'

const authController = {
  register: async (req, res) => {
    try {
      // Validate email format
      const { email, password, fullName } = req.body;

      if (!email.match(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/)) {
        return res.status(400).json("Invalid email format");
      }

      if (!fullName) {
        return res.status(400).json("Name required");
      }

      // Check if email already exists
      const existedEmail = await User.findOne({ email: email });
      if (existedEmail) {
        return res.status(400).json("The email has been registered");
      }

      // Validate password format
      if (password.length < 6) {
        return res
          .status(400)
          .send("Password must be longer than 5 characters");
      }
      if (!password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])\S+$/)) {
        return res
          .status(400)
          .json(
            "Password must include at least one uppercase letter, one number, one special character, and no spaces"
          );
      }
      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Save user into database
      const newUser = new User({
        email: req.body.email,
        password: hashedPassword,
        fullName,
        createdAt: Date.now(),
        updatedAt: Date.now()
      });
      const user = await newUser.save();

      // Generate Refresh Token
      const refreshToken = await generateRefreshToken(user);
      await User.findByIdAndUpdate(user._id, { token: refreshToken });

      // Return user json
      const { token, ...others } = user._doc;
      return res.status(201).json(others);
    } catch (err) {
      return res.status(500).json(err);
    }
  },

  login: async (req, res) => {
    try {
      // Check username exist
      const { email, password } = req.body;
      const user = await User.findOne({ email: email });
      if (!user) {
        return res.status(404).json("Incorrect username or password.");
      }

      // Check password valid
      const validPassword = await bcrypt.compare(
        password,
        user.password
      );
      if (!validPassword) {
        return res.status(404).json("Incorrect username or password.");
      }

      // Generate Access Token and Login
      if (user && validPassword) {
        const accessToken = await generateAccessToken(user);

        res.cookie("refreshToken", user.token, {
          maxAge: 365 * 24 * 60 * 60 * 1000,
          httpOnly: true,
          secure: false,
          path: "/",
          sameSite: "None",
        });

        const { password, token, ...others } = user._doc;
        res.status(200).json({ ...others, accessToken });
      }
    } catch (err) {
      return res.status(500).json(err);
    }
  },

  googleLogin: async (req, res) => {
    try {
      const { accessToken } = req.body;
      
      if (!accessToken) {
        return res.status(400).json({ message: 'Missing access token' });
      }
      const decodedToken = await admin.auth().verifyIdToken(accessToken);

      if(!decodedToken){
        return res.status(400).json({ message: 'Google authentication failed' });
      }
      

      const { email, name, picture } = decodedToken;

      if (!email) {
        return res.status(400).json({ message: 'Invalid Google account' });
      }
      
      const user = await User.findOne({ email });
      if (user) {
        const accessToken = await generateAccessToken(user);
        res.cookie("refreshToken", user.token, {
          maxAge: 365 * 24 * 60 * 60 * 1000,
          httpOnly: true,
          secure: true,
          path: "/",
          sameSite: "Strict",
        });
        const { password, token, ...others } = user._doc;
        return res.status(200).json({ ...others, accessToken });
      } else {
        const generatedPassword =
          Math.random().toString(36).slice(-8) +
          Math.random().toString(36).slice(-8);
        const hashedPassword = bcrypt.hashSync(generatedPassword, 10);
        const newUser = new User({
          email,
          password: hashedPassword,
          avatar: picture,
          fullName:name
        });
        
        const userGoogle = await newUser.save();
        
        const refreshToken = await generateRefreshToken(userGoogle);
        await User.findByIdAndUpdate(userGoogle._id, { token: refreshToken });
        const accessToken = await generateAccessToken(userGoogle);

        res.cookie("refreshToken", refreshToken, {
          maxAge: 365 * 24 * 60 * 60 * 1000,
          httpOnly: true,
          secure: true,
          path: "/",
          sameSite: "strict",
        });
        const { password, token, ...others } = userGoogle._doc;

        
        return res.status(200).json({ ...others, accessToken });
      }
    } catch (err) {
      console.log(err);
      
      return res.status(500).json(err);
    }
  },

  getAllUsers: async (req, res) => {
    try {
      const users = await User.find();
      if(users.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Users not found"
        });
      }
      return res.status(200).json(users);
    } catch (error) {
      return res.status(500).json(error);
    }
  }
}

export default authController;
