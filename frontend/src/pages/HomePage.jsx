import React, { useEffect, useReducer } from "react";
import axios from "axios";
import { Row, Col } from "react-bootstrap";
import Product from "../component/Product.jsx";
import Loading from "../component/Loading.jsx";
import MessageBox from "../component/MessageBox.jsx";
const reducer = (state, action) => {
  switch (action.type) {
    case "FETCHREQUST":
      return { ...state, loading: true };
    case "FETCHSUCCESS":
      return { ...state, loading: false, products: action.payload };
    case "FETCHFAIL":
      return { ...state, loading: false, errors: action.payload };
    default:
      return state;
  }
};
const intialState = { products: [], loading: true, errors: "" };
function HomePage() {
  const [{ products, loading, errors }, dispatch] = useReducer(
    reducer,
    intialState,
  );

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: "FETCHREQUST" });
      try {
        const result = await axios.get("https://souq-store-serv.vercel.app/api/products");
        dispatch({ type: "FETCHSUCCESS", payload: result.data });
        console.log(result.data);
      } catch (error) {
        dispatch({ type: "FETCHFAIL", payload: error.message });
      }
    };

    fetchData();
  }, []);
  // console.log(products);

  return (
    <div>
      <title>Souq</title>
      <h1>Featured Products</h1>
      <div className="products">
        {loading ? (
          <Loading />
        ) : errors ? (
          <MessageBox>{errors.message}</MessageBox>
        ) : (
          <Row>
            {products.map((product) => (
              <Col key={product.slug} sm={6} md={4} lg={3} className="mb-3">
                <Product product={product} />
              </Col>
            ))}
          </Row>
        )}
      </div>
    </div>
  );
}

export default HomePage;
