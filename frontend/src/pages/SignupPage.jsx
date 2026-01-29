import axios from "axios";
import React, { useEffect } from "react";
import { useContext } from "react";
import { useState } from "react";
import { Button, Container, Form } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Store } from "../Store";
import { toast } from "react-toastify";
import CheckOutSteps from "../component/CheckOutSteps";

function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { search } = useLocation();
  const navigate = useNavigate();
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const user = state.user;
  const redirectURL = new URLSearchParams(search).get("redirect");
  const redirect = redirectURL ? redirectURL : "/";

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      if (password !== confirmPassword) {
        toast.error("Password and Confirm Password Not Matched");
        return;
      }
      const { data } = await axios.post("/api/users/signup", {
        name,
        email,
        password,
      });
      ctxDispatch({ type: "USER_SIGNUP", payload: data });
      localStorage.setItem("userInfo", JSON.stringify(data));
      navigate(redirect || "/");
    } catch (error) {
      toast.error("Invalid email or password");
    }
  };
  useEffect(() => {
    if (user) {
      navigate(redirect);
    }
  }, [navigate, redirect, user]);
  return (
    <div>
      <title>Signup</title>
      <Container className="small-container">
        {redirect === "/shipping" && <CheckOutSteps step1 />}
        <h1 className="my-3">Sign Up</h1>
        <Form onSubmit={(e) => submitHandler(e)}>
          <Form.Group className="mb-3" controlId="name">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              required
              onChange={(e) => setName(e.target.value)}
            ></Form.Control>
          </Form.Group>
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
          <Form.Group className="mb-3" controlId="confirmPassword">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type="password"
              required
              onChange={(e) => setConfirmPassword(e.target.value)}
            ></Form.Control>
          </Form.Group>
          <div className="mb-3">
            <Button type="submit">Sign Up</Button>
          </div>
          <div className="mb-3">
            Already have account?
            <Link to={`/signin?redirect=${redirect}`}>Sign In</Link>
          </div>
        </Form>
      </Container>
    </div>
  );
}

export default SignupPage;
