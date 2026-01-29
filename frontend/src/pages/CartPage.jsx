import React, { useContext } from "react";
import { Store } from "../Store";
import { Row, Col, ListGroup, Button, Card } from "react-bootstrap";
import MessageBox from "../component/MessageBox";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function CartPage() {
  const navigate = useNavigate();
  const { state, dispatch } = useContext(Store);
  const { cartItems } = state.cart;
  const updateCartHandler = async (item, quantity) => {
    const { data } = await axios.get(`/api/products/${item._id}`);
    if (data.countInStock < quantity) {
      alert("Sorry this product is not found in stock");
      return;
    }
    dispatch({ type: "ADD_TO_CART", payload: { ...item, quantity } });
  };
  const removeItemHandler = (item) => {
    dispatch({ type: "RMOVE_ITEM_CART", payload: item });
  };
  const checkOutHandler = () => {
    navigate("/signin?redirect=/shipping");
  };

  return (
    <div>
      <title>Shopping Cart</title>
      <h1>Shopping Cart</h1>
      <Row>
        <Col md={8}>
          {cartItems.length === 0 ? (
            <MessageBox>
              Cart is empty : <Link to={"/"}>Go To Shopping</Link>
            </MessageBox>
          ) : (
            <ListGroup>
              {cartItems.map((item) => (
                <ListGroup.Item key={item._id}>
                  <Row className="align-items-center">
                    <Col md={4}>
                      <img
                        src={item.image}
                        alt={item.name}
                        className="rounded img-fluid img-thumbnail"
                      />{" "}
                      <Link to={`/product/${item.slug}`}>{item.name}</Link>
                    </Col>
                    <Col md={3}>
                      <Button
                        variant="light "
                        disabled={item.quantity === 1}
                        onClick={() =>
                          updateCartHandler(item, item.quantity - 1)
                        }
                      >
                        <i className="fas fa-minus-circle"></i>
                      </Button>{" "}
                      <span>{item.quantity}</span>{" "}
                      <Button
                        variant="light"
                        disabled={item.quantity === item.countInStock}
                        onClick={() =>
                          updateCartHandler(item, item.quantity + 1)
                        }
                      >
                        <i className="fas fa-plus-circle"></i>
                      </Button>
                    </Col>
                    <Col md={3}>${item.price}</Col>
                    <Col md={2}>
                      <Button
                        variant="light"
                        onClick={() => removeItemHandler(item)}
                      >
                        <i className="fas fa-trash"></i>
                      </Button>
                    </Col>
                  </Row>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Col>
        <Col md={4}>
          <Card>
            <Card.Body>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <h5>
                    Subtotal is : (
                    {cartItems.reduce((a, b) => a + b.quantity, 0)} Items ): ${" "}
                    {cartItems.reduce((a, b) => a + b.price * b.quantity, 0)}
                  </h5>
                </ListGroup.Item>
                <ListGroup.Item>
                  <div className="d-grid">
                    <Button
                      type="button"
                      disabled={cartItems.length === 0}
                      variant="primary"
                      onClick={() => checkOutHandler()}
                    >
                      Process To Checkout
                    </Button>
                  </div>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
        <Col md={2}></Col>
      </Row>
    </div>
  );
}

export default CartPage;
