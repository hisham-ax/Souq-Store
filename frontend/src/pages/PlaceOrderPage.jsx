import React, { useContext, useEffect, useReducer } from "react";
import CheckOutSteps from "../component/CheckOutSteps";
import {
  Button,
  CardBody,
  CardText,
  CardTitle,
  ListGroup,
} from "react-bootstrap";
import { Store } from "../Store";
import { Row, Col, Card } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Loading from "../component/Loading";
import { toast } from "react-toastify";
import errorsHandler from "../utils/errorsHandler";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, loading: false };
    case "FETCH_FAIL":
      return { ...state, loading: false };
    default:
      return state;
  }
};
function PlaceOrderPage() {
  const [{ loading }, dispatch] = useReducer(reducer, {
    loading: false,
  });
  const navigate = useNavigate();
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart, user } = state;

  const round2 = (num) => Math.round(num * 100 + Number.EPSILON) / 100;
  cart.itemsPrice = round2(
    cart.cartItems.reduce((a, c) => a + c.quantity * c.price, 0),
  );

  cart.shippingPrice = cart.itemsPrice > 100 ? round2(0) : round2(10);
  cart.taxPrice = round2(0.15 * cart.itemsPrice);
  cart.totalPrice = cart.itemsPrice + cart.shippingPrice + cart.taxPrice;
  const placeOrderHandler = async () => {
    console.log({
      orderItems: cart.cartItems.map((x) => ({ ...x, product: x._id })),
      shippingAddress: cart.shippingAddress,
      paymentMethod: cart.paymentMethod,
      itemsPrice: cart.itemsPrice,
      shippingPrice: cart.shippingPrice,
      taxPrice: cart.taxPrice,
      totalPrice: cart.totalPrice,
    });
    dispatch({ type: "FETCH_REQUST" });
    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_API_SERVER_URL}/api/orders`,
        {
          orderItems: cart.cartItems,
          shippingAddress: cart.shippingAddress,
          paymentMethod: cart.paymentMethod,
          itemsPrice: cart.itemsPrice,
          shippingPrice: cart.shippingPrice,
          taxPrice: cart.taxPrice,
          totalPrice: cart.totalPrice,
        },
        {
          headers: {
            authorization: `Souq ${user.token}`,
          },
        },
      );
      ctxDispatch({ type: "CLEAR_CART" });
      dispatch({ type: "FETCH_SUCCESS", payload: data });
      localStorage.removeItem("cartItems");
      navigate(`/order/${data.order._id}`);
    } catch (error) {
      dispatch({ type: "FETCH_FAIL" });
      toast.error(errorsHandler(error));
    }
  };
  useEffect(() => {
    if (!cart.paymentMethod) {
      navigate("/payment");
    }
  }, [navigate, cart.paymentMethod]);
  return (
    <div>
      <title>Preview Order</title>
      <CheckOutSteps step1 step2 step3 step4 />
      <h1>Preview Order</h1>
      <Row>
        <Col md={8}>
          <Card className="mb-3">
            <CardBody>
              <CardTitle>Shipping</CardTitle>
              <CardText>
                <strong>Name :</strong> {cart.shippingAddress.fullname} <br />
                <strong>Address: </strong>
                {cart.shippingAddress.address},{cart.shippingAddress.city},{" "}
                {cart.shippingAddress.country},{cart.shippingAddress.postalCode}
              </CardText>
              <Link to={"/shipping"}>Edit</Link>
            </CardBody>
          </Card>
          <Card className="mb-3">
            <CardBody>
              <CardTitle>Payment</CardTitle>
              <CardText>
                <strong>Method: </strong>
                {cart.paymentMethod}
              </CardText>
              <Link to={"/payment"}>Edit</Link>
            </CardBody>
          </Card>
          <Card className="mb-3">
            <CardBody>
              <CardTitle>Cart Items</CardTitle>
              <ListGroup variant="flush">
                {cart.cartItems.map((item) => (
                  <ListGroup.Item key={item._id}>
                    <Row className="align-items-center">
                      <Col md={6}>
                        <img
                          src={item.image}
                          alt={item.alt}
                          className="img-fluid rounded img-thumbnail"
                        ></img>
                        <Link to={`/product/${item.slug}`}>{item.name}</Link>
                      </Col>
                      <Col md={3}>
                        <span>{item.quantity}</span>
                      </Col>
                      <Col md={3}>${item.price}</Col>
                    </Row>
                  </ListGroup.Item>
                ))}
              </ListGroup>
              <Link to={"/cart"}>Edit</Link>
            </CardBody>
          </Card>
        </Col>
        <Col md={4}>
          <Card>
            <CardBody>
              <CardTitle>Order Summary</CardTitle>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <Row>
                    <Col>Items: </Col>
                    <Col>${cart.itemsPrice.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Shipping: </Col>
                    <Col>${cart.shippingPrice.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Tax: </Col>
                    <Col>${cart.taxPrice.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>
                      <strong>Total Price: </strong>
                    </Col>
                    <Col>
                      <strong>${cart.totalPrice.toFixed(2)}</strong>
                    </Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <div className="d-grid">
                    <Button
                      type="button"
                      onClick={placeOrderHandler}
                      disabled={cart.cartItems.length === 0}
                    >
                      Place Order
                    </Button>
                  </div>
                  {loading && <Loading />}
                </ListGroup.Item>
              </ListGroup>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default PlaceOrderPage;
