import React, { useContext, useReducer, useState } from "react";
import { Store } from "../Store";
import { Button, Form } from "react-bootstrap";
import { toast } from "react-toastify";
import errorsHandler from "../utils/errorsHandler";
import axios from "axios";
import Loading from "../component/Loading";

const reducer = (state, action) => {
  switch (action.type) {
    case "UPDATE_REQUEST":
      return { ...state, loadingUpdate: true };
    case "UPDATE_SUCCESS":
      return { ...state, loadingUpdate: false };
    case "UPDATE_FAIL":
      return { ...state, loadingUpdate: false };
    default:
      return state;
  }
};
function ProfilePage() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { user } = state;
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPssword] = useState("");

  const [{ loadingUpdate }, dispatch] = useReducer(reducer, {
    loadingUpdate: false,
  });
  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.put(
        `${process.env.REACT_APP_API_SERVER_URL}/api/users/profile`,
        {
          name,
          email,
          password,
        },
        {
          headers: {
            Authorization: `Souq ${user.token}`,
          },
        },
      );
      console.log(data);
      dispatch({ type: "UPDATE_SUCCESS", payload: data });
      localStorage.setItem("userInfo", JSON.stringify(data));
      ctxDispatch({ type: "USER_SIGNIN", payload: data });
      toast.success("User Updated Successfully");
    } catch (error) {
      dispatch({ type: "UPDATE_FAIL" });
      toast.error(errorsHandler(error));
    }
  };
  return (
    <div className="container small-container">
      <title>User Profile</title>
      <h1 className="my-3">User Profile</h1>
      {loadingUpdate ? (
        <Loading />
      ) : (
        <form onSubmit={submitHandler}>
          <Form.Group className="my-3" controlId="name">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            ></Form.Control>
          </Form.Group>
          <Form.Group className="my-3" controlId="email">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            ></Form.Control>
          </Form.Group>
          <Form.Group className="my-3" controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            ></Form.Control>
          </Form.Group>
          <Form.Group className="my-3" controlId="password">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPssword(e.target.value)}
              required
            ></Form.Control>
          </Form.Group>
          <div className="mb-3">
            <Button type="submit">Update</Button>
          </div>
        </form>
      )}
    </div>
  );
}

export default ProfilePage;
