import express from "express";
import Products from "../models/ProductModel.js";

const productRouter = express.Router();

productRouter.get("/", async (req, res) => {
  const data = await Products.find();
  res.send(data);
});
productRouter.get("/slug/:slug", async (req, res) => {
  const product = await Products.findOne({ slug: req.params.slug });
  if (product) {
    res.send(product);
  } else {
    res.status(404).send({ message: "This product not found in database" });
  }
});
productRouter.get("/:id", async (req, res) => {
  const product = await Products.findById(req.params.id);
  if (product) {
    res.send(product);
  } else {
    res.status(404).send({ message: "This product not found in database" });
  }
});

export default productRouter;
