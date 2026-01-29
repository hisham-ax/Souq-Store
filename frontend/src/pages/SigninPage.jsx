import axios from "axios";
import React, { useEffect } from "react";
import { useContext } from "react";
import { useState } from "react";
import { Button, Container, Form } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Store } from "../Store";
import { toast } from "react-toastify";
import CheckOutSteps from "../component/CheckOutSteps";

function SigninPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { search } = useLocation();
  const navigate = useNavigate();
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const user = state.user;
  const redirectURL = new URLSearchParams(search).get("redirect");
  const redirect = redirectURL ? redirectURL : "/";
  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("/api/users/signin", {
        email,
        password,
      });
      ctxDispatch({ type: "USER_SIGNIN", payload: data });
      localStorage.setItem("userInfo", JSON.stringify(data));
      navigate(redirect || "/");
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
  useEffect(() => {
    if (user) {
      navigate(redirect);
    }
  }, [navigate, redirect, user]);
  return (
    <div>
      <title>Signin</title>
      <Container className="small-container">
        {redirect === "/shipping" && <CheckOutSteps step1 />}
        <h1 className="my-3">Sign In</h1>
        <Form onSubmit={submitHandler}>
          <Form.Group className="mb-3" controlId="email">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              required
              onChange={(e) => setEmail(e.target.value)}
            ></Form.Control>
          </Form.Group>
          <Form.Group className="mb-3" controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              required
              onChange={(e) => setPassword(e.target.value)}
            ></Form.Control>
          </Form.Group>
          <div className="mb-3">
            <Button type="submit">Sign In</Button>
          </div>
          <div className="mb-3">
            New Customer?
            <Link to={`/signup?redirect=${redirect}`}>Create Your Account</Link>
          </div>
        </Form>
      </Container>
    </div>
  );
}

export default SigninPage;
