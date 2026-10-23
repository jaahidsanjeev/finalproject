
import { useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleWishlist } from "../redux/wishlistSlice";
import { addToCart } from "../redux/cartSlice";
import { Link } from "react-router-dom";
import { ThemeContext } from "../ThemeContext";
import "../App.css";

function Wishlist() {
  const dispatch = useDispatch();
  const { darkMode } = useContext(ThemeContext);

  const items = useSelector(
    (state) => state.wishlist.items
  );

  return (
    <section
      className={
        darkMode
          ? "products-section dark-mode"
          : "products-section"
      }
    >
      <h2>My Wishlist ♥</h2>

      <Link to="/">← Continue Shopping</Link>

      {items.length === 0 ? (
        <div className="empty-cart">
          <h3>Your wishlist is empty!</h3>
          <p>Save products you love and find them here.</p>
          <Link to="/">Continue Shopping</Link>
        </div>
      ) : (
        <div className="product-grid">
          {items.map((product) => (
            <div className="product-card" key={product.id}>
              <img
                src={product.thumbnail}
                alt={product.title}
              />

              <div className="product-info">
                <h3>{product.title}</h3>
                <p className="price">${product.price}</p>

                <button
                  onClick={() => dispatch(addToCart(product))}
                >
                  Add to Cart
                </button>

                <button
                  onClick={() =>
                    dispatch(toggleWishlist(product))
                  }
                >
                  Remove from Wishlist
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default Wishlist;
