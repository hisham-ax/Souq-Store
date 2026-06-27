import React, { useContext, useEffect, useReducer } from "react";
import axios from "axios";
import { Badge, Button, Card, Col, ListGroup, Row } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import Rating from "../component/Rating";
import Loading from "../component/Loading";
import MessageBox from "../component/MessageBox";
import errorsHandler from "../utils/errorsHandler.js";
import { Store } from "../Store.js";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCHREQUST":
      return { ...state, loading: true };
    case "FETCHSUCCESS":
      return { ...state, loading: false, product: action.payload };
    case "FETCHFAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};
function ProductPage() {
  const navigate = useNavigate();
  const [{ product, loading, error }, dispatch] = useReducer(reducer, {
    product: {},
    loading: true,
    error: "",
  });
  const params = useParams();
  const { slug } = params;

  useEffect(() => {
    const fetchProduct = async () => {
      dispatch({ type: "FETCHREQUST" });
      const result = await axios.get(
        `${process.env.REACT_APP_API_SERVER_URL}/api/products/slug/${slug}`,
      );
      try {
        dispatch({ type: "FETCHSUCCESS", payload: result.data });
      } catch (error) {
        dispatch({ type: "FETCHFAIL", payload: errorsHandler(error) });
      }
    };
    fetchProduct();
  }, [slug]);
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const addToCartHandle = async () => {
    const exitItem = state.cart.cartItems.find((x) => x._id === product._id);
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

  return loading ? (
    <Loading />
  ) : error ? (
    <MessageBox variant="danger">{error}</MessageBox>
  ) : (
    <div className="m-4">
      <title>{product.name}</title>
      <Row>
        <Col sm={12} md={6}>
          <img className="img-large" src={product.image} alt={product.name} />
        </Col>
        <Col sm={12} md={3}>
          <ListGroup variant="flush">
            <ListGroup.Item>Product Name: {product.name}</ListGroup.Item>
            <ListGroup.Item>
              <Rating rating={product.rating} numReviews={product.numReviews} />
            </ListGroup.Item>
            <ListGroup.Item>Price: ${product.price}</ListGroup.Item>
            <ListGroup.Item>Description: {product.description}</ListGroup.Item>
          </ListGroup>
        </Col>
        <Col sm={12} md={3}>
          <Card>
            <Card.Body>
              <ListGroup>
                <ListGroup.Item>
                  <Row>
                    <Col>Price:</Col>
                    <Col>${product.price}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Status:</Col>
                    <Col>
                      {product.countInStock > 0 ? (
                        <Badge bg="success">In Stock </Badge>
                      ) : (
                        <Badge bg="danger">Unavailable</Badge>
                      )}
                    </Col>
                  </Row>
                </ListGroup.Item>

                {product.countInStock > 0 && (
                  <ListGroup.Item>
                    <div className="d-grid">
                      <Button onClick={addToCartHandle} variant="primary">
                        Add To Cart
                      </Button>
                    </div>
                  </ListGroup.Item>
                )}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default ProductPage;
