import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "./component/Header";
import ProductPage from "./pages/ProductPage";
import Container from "react-bootstrap/esm/Container";
import Footer from "./component/Footer";
import CartPage from "./pages/CartPage";
import SigninPage from "./pages/SigninPage";
import ShippingPage from "./pages/ShippingPage";
import SignupPage from "./pages/SignupPage";
import PaymentMethodPage from "./pages/PaymentMethodPage";
import PlaceOrderPage from "./pages/PlaceOrderPage";
import OrderPage from "./pages/OrderPage";
function App() {
  return (
    <BrowserRouter>
      <div className="d-flex flex-column site-container">
        <ToastContainer position={"bottom-right"} limit={1} />
        <Header />
        <main>
          <Container>
            <Routes>
              <Route path="/product/:slug" element={<ProductPage />} />
              <Route path="/signin" element={<SigninPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/shipping" element={<ShippingPage />} />
              <Route path="/payment" element={<PaymentMethodPage />} />
              <Route path="/placeorder" element={<PlaceOrderPage />} />
              <Route path="/order/:id" element={<OrderPage />} />
              <Route path="/" element={<HomePage />} />
            </Routes>
          </Container>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
