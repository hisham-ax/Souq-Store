import mongoose, { Schema } from "mongoose";

const ProductShema = new Schema(
  {
    name: { type: String, require: true },
    slug: { type: String, require: true, unique: true },
    category: { type: String, require: true },
    image: { type: String, require: true, unique: true },
    brand: { type: String, require: true },
    description: { type: String },
    price: { type: Number, require: true },
    countInStock: { type: Number, require: true },
    rating: { type: Number, require: true },
    numReviews: { type: Number, require: true },
  },
  {
    timestamps: true,
  },
);
const Products = mongoose.model("Products", ProductShema);
export default Products;
