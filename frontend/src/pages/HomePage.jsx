import React, { useEffect, useReducer } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import logger from "use-reducer-logger";
// import data from "../../../backend/data";
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
    logger(reducer),
    intialState
  );
  // const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: "FETCHREQUST" });
      const result = await axios.get("/api/products");
      try {
        dispatch({ type: "FETCHSUCCESS", payload: result.data.products });
      } catch (error) {
        dispatch({ type: "FETCHFAIL", payload: error.message });
      }
    };

    fetchData();
  }, []);
  // console.log(products);

  return (
    <div>
      <h1>Featured Products</h1>
      <div className="products">
        {loading ? (
          <div>Lodding...</div>
        ) : errors ? (
          <div>{errors.message} </div>
        ) : (
          products.map((product) => (
            <div className="product" key={product.slug}>
              <Link href={`/product/${product.slug}`}>
                <img src={product.image} alt={product.name} />
              </Link>
              <div className="product-info">
                <Link href={`/product/${product.slug}`}>
                  <p>{product.name}</p>
                </Link>
                <p style={{ fontWeight: "bold" }}>{product.price}</p>
                <button>Add To Cart</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default HomePage;
