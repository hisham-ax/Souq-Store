import express from "express";
import Products from "../models/ProductModel.js";
import data from "../data.js";
import User from "../models/UserModel.js";

const seedRouter = express.Router();

seedRouter.get("/", async (req, res) => {
  await Products.deleteMany({});
  await User.deleteMany({});
  // Remove the unique index on category
  const createdProducts = await Products.insertMany(data.products);
  const createdUsers = await User.insertMany(data.users);

  res.send({ createdUsers, createdProducts });
});

export default seedRouter;
