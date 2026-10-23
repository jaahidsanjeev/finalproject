
import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearCart } from "../redux/cartSlice";
import { ThemeContext } from "../ThemeContext";
import "../App.css";

function Checkout() {
  const dispatch = useDispatch();
  const { darkMode } = useContext(ThemeContext);
  const cartItems = useSelector((state) => state.cart.items);

  const [customer, setCustomer] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    pincode: ""
  });

  const [orderId, setOrderId] = useState("");

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const delivery = cartItems.length > 0 ? 50 : 0;
  const total = subtotal + delivery;

  function handleChange(e) {
    setCustomer({
      ...customer,
      [e.target.name]: e.target.value
    });
  }

  function handleSubmit(e) {
    e.preventDefault();

    const newOrderId =
      "LUMA" + Date.now().toString().slice(-8);

    setOrderId(newOrderId);
    dispatch(clearCart());
  }

  if (orderId) {
    return (
      <div className={darkMode ? "app dark-mode" : "app"}>
        <div className="checkout-success">
          <div className="success-icon">✓</div>
          <h1>Order Placed Successfully!</h1>
          <p>Thank you for shopping with Luma Store.</p>

          <p>
            Order ID: <strong>{orderId}</strong>
          </p>

          <p>Total: ${total.toFixed(2)}</p>

          <p className="demo-note">
            This is a demo order. No real payment was collected.
          </p>

          <Link to="/" className="checkout-button">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className={darkMode ? "app dark-mode" : "app"}>
        <div className="checkout-empty">
          <h2>Your cart is empty</h2>
          <p>Add products before checking out.</p>

          <Link to="/" className="checkout-button">
            Shop Now
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={darkMode ? "app dark-mode" : "app"}>
      <div className="checkout-container">
        <Link to="/cart" className="checkout-back">
          ← Back to Cart
        </Link>

        <h1>Checkout</h1>
        <p className="checkout-subtitle">
          Enter your delivery information.
        </p>

        <div className="checkout-layout">
          <form
            className="checkout-form"
            onSubmit={handleSubmit}
          >
            <h2>Delivery Information</h2>

            <label htmlFor="name">Full Name</label>
            <input
              id="name"
              name="name"
              value={customer.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
            />

            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              name="email"
              type="email"
              value={customer.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />

            <label htmlFor="phone">Phone Number</label>
            <input
              id="phone"
              name="phone"
              type="tel"
              pattern="[0-9]{10}"
              maxLength="10"
              value={customer.phone}
              onChange={handleChange}
              placeholder="10-digit phone number"
              required
            />

            <label htmlFor="address">Delivery Address</label>
            <textarea
              id="address"
              name="address"
              rows="3"
              value={customer.address}
              onChange={handleChange}
              placeholder="House number, street and area"
              required
            />

            <label htmlFor="city">City</label>
            <input
              id="city"
              name="city"
              value={customer.city}
              onChange={handleChange}
              placeholder="Enter your city"
              required
            />

            <label htmlFor="pincode">PIN Code</label>
            <input
              id="pincode"
              name="pincode"
              inputMode="numeric"
              pattern="[0-9]{6}"
              maxLength="6"
              value={customer.pincode}
              onChange={handleChange}
              placeholder="6-digit PIN code"
              required
            />

            <button type="submit" className="checkout-button">
              Place Demo Order
            </button>

            <p className="demo-note">
              Demo only. No real payment is processed.
            </p>
          </form>

          <div className="order-summary">
            <h2>Order Summary</h2>

            {cartItems.map((item) => (
              <div className="summary-item" key={item.id}>
                <img src={item.thumbnail} alt={item.title} />

                <div className="summary-item-info">
                  <h3>{item.title}</h3>
                  <p>Quantity: {item.quantity}</p>
                  <p>
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}

            <div className="summary-total">
              <p>
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </p>

              <p>
                <span>Delivery</span>
                <span>${delivery.toFixed(2)}</span>
              </p>

              <h3>
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
