
import { useContext } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
} from "../redux/cartSlice";
import { ThemeContext } from "../ThemeContext";
import "../App.css";

function Cart() {
  const dispatch = useDispatch();
  const { darkMode } = useContext(ThemeContext);

  const cartItems = useSelector((state) => state.cart.items);

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <section
      className={
        darkMode
          ? "products-section dark-mode"
          : "products-section"
      }
    >
      <h2>My Shopping Cart</h2>

      <Link to="/">← Continue Shopping</Link>

      {cartItems.length === 0 ? (
        <div className="empty-cart">
          <h3>Your cart is empty!</h3>
          <p>Add some products to start shopping.</p>
          <Link to="/">Continue Shopping</Link>
        </div>
      ) : (
        <>
          {cartItems.map((item) => (
            <div className="cart-item" key={item.id}>
              <img src={item.thumbnail} alt={item.title} />

              <div className="cart-info">
                <h3>{item.title}</h3>
                <p>${item.price}</p>

                <div className="quantity">
                  <button
                    onClick={() =>
                      dispatch(decreaseQuantity(item.id))
                    }
                  >
                    -
                  </button>

                  <span>{item.quantity}</span>

                  <button
                    onClick={() =>
                      dispatch(increaseQuantity(item.id))
                    }
                  >
                    +
                  </button>
                </div>

                <button
                  className="remove-btn"
                  onClick={() =>
                    dispatch(removeFromCart(item.id))
                  }
                >
                  Remove
                </button>
              </div>

              <h3>
                ${(item.price * item.quantity).toFixed(2)}
              </h3>
            </div>
          ))}

          <div className="cart-total">
            <h2>Total: ${total.toFixed(2)}</h2>

            <Link to="/checkout" className="checkout-button">
              Proceed to Checkout →
            </Link>
          </div>
        </>
      )}
    </section>
  );
}

export default Cart;
