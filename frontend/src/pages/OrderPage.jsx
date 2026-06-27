import React, { useContext, useEffect, useReducer } from "react";
import { CardBody, CardText, CardTitle, ListGroup } from "react-bootstrap";
import { Store } from "../Store";
import { Row, Col, Card } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Loading from "../component/Loading";
import { toast } from "react-toastify";
import errorsHandler from "../utils/errorsHandler";
import MessageBox from "../component/MessageBox";
import { usePayPalScriptReducer, PayPalButtons } from "@paypal/react-paypal-js";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, order: action.payload };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    case "PAY_REQUEST":
      return { ...state, loadingPay: true };
    case "PAY_SUCCESS":
      return { ...state, loadingPay: false, successPay: true };
    case "PAY_FAIL":
      return { ...state, loadingPay: false };
    case "PAY_RESET":
      return { ...state, loadingPay: false, successPay: false };
    default:
      return state;
  }
};
function OrderPage() {
  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();
  const { state } = useContext(Store);
  const { user } = state;
  const [{ loading, error, order, successPay }, dispatch] = useReducer(
    reducer,
    {
      loading: true,
      order: {},
      error: "",
      successPay: false,
    },
  );
  const navigate = useNavigate();
  const params = useParams();
  const { id: orderId } = params;

  const createOrder = (data, actions) => {
    return actions.order
      .create({
        purchase_units: [{ amount: { value: order.totalPrice } }],
      })
      .then((orderId) => {
        return orderId;
      });
  };
  const onApprove = (data, actions) => {
    return actions.order.capture().then(async function (details) {
      try {
        dispatch({ type: "PAY_REQUEST" });
        const { data } = await axios.put(
          `${process.env.REACT_APP_API_SERVER_URL}/api/orders/${order._id}/pay`,
          details,
          {
            headers: {
              authorization: `Souq ${user.token}`,
            },
          },
        );
        dispatch({ type: "PAY_SUCCESS", payload: data });
        toast.success("Order is Paid");
      } catch (error) {
        dispatch({ type: "PAY_FAIL", payload: errorsHandler(error) });
        toast.error(errorsHandler(error));
      }
    });
  };
  const onError = (err) => {
    toast.error(errorsHandler(err));
  };
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        dispatch({ type: "FETCH_REQUST" });
        const { data } = await axios.get(
          `${process.env.REACT_APP_API_SERVER_URL}/api/orders/${orderId}`,
          {
            headers: {
              authorization: `Souq ${user.token}`,
            },
          },
        );
        dispatch({ type: "FETCH_SUCCESS", payload: data });
        console.log(data);
      } catch (error) {
        dispatch({ type: "FETCH_FAIL" });
        toast.error(errorsHandler(error));
      }
    };
    if (!order._id || successPay || (order._id && order._id !== orderId)) {
      fetchOrder();
      if (successPay) {
        dispatch({ type: "PAY_RESET" });
      }
    } else {
      const loadingPaypalScript = async () => {
        const { data: clintId } = await axios.get(
          `${process.env.REACT_APP_API_SERVER_URL}/api/keys/paypal`,
          {
            headers: {
              authorization: `Souq ${user.token}`,
            },
          },
        );
        paypalDispatch({
          type: "resetOptions",
          value: {
            "client-id": clintId,
            currency: "USD",
          },
        });
        paypalDispatch({ type: "setLoadingStatus", value: "pending" });
      };
      loadingPaypalScript();
    }
    if (!user) {
      navigate("/signin");
    }
  }, [navigate, orderId, user, order, paypalDispatch, successPay]);

  return loading ? (
    <Loading />
  ) : error ? (
    <MessageBox variant="danger"></MessageBox>
  ) : (
    <div>
      <title>Order {orderId}</title>
      <h1>Order {orderId}</h1>
      <Row>
        <Col md={8}>
          <Card className="mb-3">
            <CardBody>
              <CardTitle>Shipping Address</CardTitle>
              <CardText>
                <strong>Name :</strong> {order.shippingAddress.fullname} <br />
                <strong>Address: </strong>
                {order.shippingAddress.address},{order.shippingAddress.city},{" "}
                {order.shippingAddress.country},
                {order.shippingAddress.postalCode}
              </CardText>
              {order.isDelivered ? (
                <MessageBox variant="success">
                  Delivered at {order.deliveredAt}
                </MessageBox>
              ) : (
                <MessageBox variant="danger">Not Delivered</MessageBox>
              )}
            </CardBody>
          </Card>
          <Card className="mb-3">
            <CardBody>
              <CardTitle>Payment</CardTitle>
              <CardText>
                <strong>Method: </strong>
                {order.paymentMethod}
              </CardText>
              {order.isPaid ? (
                <MessageBox variant="success">
                  Paid at {order.paidAt}
                </MessageBox>
              ) : (
                <MessageBox variant="danger">Not Paid</MessageBox>
              )}
            </CardBody>
          </Card>
          <Card className="mb-3">
            <CardBody>
              <CardTitle>Cart Items</CardTitle>
              <ListGroup variant="flush">
                {order.orderItems.map((item) => (
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
                    <Col>${order.itemsPrice}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Shipping: </Col>
                    <Col>${order.shippingPrice}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Tax: </Col>
                    <Col>${order.taxPrice}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>
                      <strong>Total Price: </strong>
                    </Col>
                    <Col>
                      <strong>${order.totalPrice}</strong>
                    </Col>
                  </Row>
                </ListGroup.Item>
                {!order.isPaid && (
                  <ListGroup.Item>
                    {isPending ? (
                      <Loading />
                    ) : (
                      <div>
                        <PayPalButtons
                          createOrder={createOrder}
                          onApprove={onApprove}
                          onError={onError}
                        ></PayPalButtons>
                      </div>
                    )}
                    {loading && <Loading></Loading>}
                  </ListGroup.Item>
                )}
              </ListGroup>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
export default OrderPage;
