import express from "express";
import User from "../models/UserModel.js";
import { generateWebToken } from "../utils.js";
import expressAsyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";

const userRouter = express.Router();

userRouter.post(
  "/signin",
  expressAsyncHandler(async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      if (bcrypt.compareSync(req.body.password, user.password)) {
        res.send({
          _id: user._id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
          token: generateWebToken(user.toObject()),
        });
        return;
      } else {
        res.status(401).json({ message: "Invalid Password" });
      }
    } else {
      res.status(401).json({ message: "Invalid username or password" });
    }
  }),
);
userRouter.post(
  "/signup",
  expressAsyncHandler(async (req, res) => {
    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password),
    });
    const user = await newUser.save();
    res.send({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateWebToken(user.toObject()),
    });
  }),
);

export default userRouter;
