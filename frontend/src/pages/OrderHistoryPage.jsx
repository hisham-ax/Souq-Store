import React, { useEffect, useContext, useReducer } from "react";
import Loading from "../component/Loading";
import MessageBox from "../component/MessageBox";
import axios from "axios";
import { toast } from "react-toastify";
import errorsHandler from "../utils/errorsHandler";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { Store } from "../Store";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, orders: action.payload };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};
function OrderHistoryPage() {
  const navigate = useNavigate();
  const { state } = useContext(Store);
  const { user } = state;
  const [{ loading, error, orders }, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
    orders: [],
  });
  useEffect(() => {
    dispatch({ type: "FETCH_REQUST" });
    const fetchData = async () => {
      try {
        const { data } = await axios.get(
          `${process.env.REACT_APP_API_SERVER_URL}/api/orders/mine`,
          {
            headers: {
              Authorization: `Souq ${user.token}`,
            },
          },
        );
        dispatch({ type: "FETCH_SUCCESS", payload: data });
        console.log(data);
      } catch (error) {
        dispatch({ type: "FETCH_FAIL", payload: error });
        toast.error(errorsHandler(error));
      }
    };
    fetchData();
  }, [user]);
  return (
    <div>
      <title>Order History</title>

      {loading ? (
        <Loading />
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Date</th>
              <th>Total</th>
              <th>Paid</th>
              <th>Delivered</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>{order.createdAt.substring(0, 10)}</td>
                <td>{order.totalPrice}</td>
                <td>{order.isPaid ? order.paidAt.supstring(0, 10) : "No"}</td>
                <td>
                  {order.isDelivered
                    ? order.deliveredAt.substring(0, 10)
                    : "No"}
                </td>
                <td>
                  <Button
                    type="button"
                    variant="light"
                    onClick={() => navigate(`/order/${order._id}`)}
                  >
                    Details
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default OrderHistoryPage;
