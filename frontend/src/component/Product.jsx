import React, { useContext } from "react";
import { Button, Card } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import Rating from "./Rating";
import { Store } from "../Store";
import axios from "axios";

function Product(props) {
  const navigate = useNavigate();
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    cart: { cartItems },
  } = state;

  const addToCartHandle = async (product) => {
    const exitItem = cartItems.find((x) => x._id === product._id);
    const quantity = exitItem ? exitItem.quantity + 1 : 1;
    const { data } = await axios.get(
      `${process.env.REACT_APP_API_SERVER_URL}/api/products/${product._id}`,
    );
    if (data.countInStock < quantity) {
      alert("Sorry this product is not found in stock");
      return;
    }
    ctxDispatch({ type: "ADD_TO_CART", payload: { ...product, quantity } });
    navigate("/cart");
  };
  return (
    <Card className="product">
      <Link to={`/product/${props.product.slug}`}>
        <Card.Img src={props.product.image} alt={props.product.name} />
      </Link>
      <Card.Body className="product-info">
        <Link to={`/product/${props.product.slug}`}>
          <Card.Title>{props.product.name}</Card.Title>
        </Link>
        <Rating
          rating={props.product.rating}
          numReviews={props.product.numReviews}
        />
        <Card.Text style={{ fontWeight: "bold" }}>
          {props.product.price}
        </Card.Text>
        {props.product.countInStock === 0 ? (
          <Button variant="light" disabled>
            Out Of Stock
          </Button>
        ) : (
          <Button onClick={() => addToCartHandle(props.product)}>
            Add To Cart
          </Button>
        )}
      </Card.Body>
    </Card>
  );
}

export default Product;
