import express, { json } from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import seedRouter from "./routers/seedRouter.js";
import productRouter from "./routers/productRouter.js";
import userRouter from "./routers/userRouter.js";
import orderRouter from "./routers/orderRouter.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//configure dot env
dotenv.config();
//connected to database
mongoose
  .connect(process.env.MONGO_DATABASE_URI)
  .then(() => {
    console.log("connected to database");
  })
  .catch((error) => console.log(error.message));
//middlewares
app.use("/api/seed", seedRouter);
app.use("/api/products", productRouter);
app.use("/api/users", userRouter);
app.use("/api/orders", orderRouter);

app.get("/api/keys/paypal", (req, res) => {
  res.send(process.env.PAYPAL_CLIENT_ID || "sb");
});
app.use((err, req, res, next) => {
  res.status(500).send({ message: err.message });
});

// const port = process.env.PORT || 5000;
// app.listen(port, () => {
//   console.log(`server at http://localhost :${port}`);
// });
export default app;
