import React, { useContext, useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { Store } from "../Store";
import { useNavigate } from "react-router-dom";
import CheckOutSteps from "../component/CheckOutSteps";

function ShippingPage() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    cart: { shippingAddress },
    user,
  } = state;
  const [fullname, setFullName] = useState(shippingAddress.fullname || "");
  const [address, setAddress] = useState(shippingAddress.address || "");
  const [city, setCity] = useState(shippingAddress.city || "");
  const [postalCode, setPostalCode] = useState(
    shippingAddress.postalCode || "",
  );
  const [country, setCountry] = useState(shippingAddress.country || "");
  const navigate = useNavigate();

  const submitHandler = (e) => {
    e.preventDefault();
    ctxDispatch({
      type: "SAVE_SHIPPING_ADDRESS",
      payload: {
        fullname,
        address,
        city,
        postalCode,
        country,
      },
    });
    localStorage.setItem(
      "shippingAddress",
      JSON.stringify({
        fullname,
        address,
        city,
        postalCode,
        country,
      }),
    );
    navigate("/payment");
  };
  useEffect(() => {
    if (!user) {
      navigate("/signin?redirect=/shipping");
    }
  }, [navigate, user]);
  return (
    <div>
      <title>Shipping Page</title>
      <CheckOutSteps step1 step2 />
      <div className="container small-container">
        <h1 className="my-3">Shipping Address</h1>
        <Form onSubmit={submitHandler}>
          <Form.Group className="mb-3" controlId="fullName">
            <Form.Label> Full Name </Form.Label>
            <Form.Control
              value={fullname}
              onChange={(e) => setFullName(e.target.value || "")}
              required
            ></Form.Control>
          </Form.Group>
          <Form.Group className="mb-3" controlId="address">
            <Form.Label> Address </Form.Label>
            <Form.Control
              value={address}
              onChange={(e) => setAddress(e.target.value || "")}
              required
            ></Form.Control>
          </Form.Group>
          <Form.Group className="mb-3" controlId="city">
            <Form.Label> City </Form.Label>
            <Form.Control
              value={city}
              onChange={(e) => setCity(e.target.value || "")}
              required
            ></Form.Control>
          </Form.Group>
          <Form.Group className="mb-3" controlId="postalCode">
            <Form.Label> Postal Code </Form.Label>
            <Form.Control
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value || "")}
              required
            ></Form.Control>
          </Form.Group>
          <Form.Group className="mb-3" controlId="country">
            <Form.Label> Country </Form.Label>
            <Form.Control
              value={country}
              onChange={(e) => setCountry(e.target.value || "")}
              required
            ></Form.Control>
          </Form.Group>
          <div className="mb-3">
            <Button variant="primary" type="submit">
              Continue
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
}

export default ShippingPage;
