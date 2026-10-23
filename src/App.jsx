
import { useEffect, useState, useContext } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "./redux/productSlice";
import { addToCart } from "./redux/cartSlice";
import { toggleWishlist } from "./redux/wishlistSlice";
import { ThemeContext } from "./ThemeContext";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import ProductDetails from "./pages/ProductDetails";
import MouseTrail from "./MouseTrail";
import Checkout from "./pages/Checkout";
import "./App.css";

function Home() {
  const dispatch = useDispatch();
  const { darkMode, toggleTheme } = useContext(ThemeContext);

  const { products, loading, error } = useSelector(
    (state) => state.products
  );

  const cartItems = useSelector((state) => state.cart.items);
  const wishlistItems = useSelector((state) => state.wishlist.items);

  const cartCount = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("default");

  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 8;

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const categories = [
    ...new Set(products.map((product) => product.category))
  ];

  let filteredProducts = products.filter((product) => {
    const matchesSearch = product.title
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesCategory =
      category === "all" || product.category === category;

    return matchesSearch && matchesCategory;
  });

  if (sort === "low") {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (sort === "high") {
    filteredProducts.sort((a, b) => b.price - a.price);
  }

  const totalPages = Math.ceil(
    filteredProducts.length / productsPerPage
  );

  const startIndex = (currentPage - 1) * productsPerPage;

  const currentProducts = filteredProducts.slice(
    startIndex,
    startIndex + productsPerPage
  );

  return (
    <div className={darkMode ? "app dark-mode" : "app"}>
      <nav className="navbar">
        <h2>
          <Link to="/">LUMA STORE</Link>
        </h2>

        <div>
          <Link to="/">Home</Link>
          <Link to="/#products">Products</Link>
          <Link to="/#products">Shop</Link>

          <Link to="/wishlist">
            Wishlist ({wishlistItems.length})
          </Link>

          <Link to="/cart">Cart ({cartCount})</Link>

          <button onClick={toggleTheme}>
            {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
          </button>
        </div>
      </nav>

      <section className="hero">
        <p>WELCOME TO LUMA</p>
        <h1>Find Your Next Favorite.</h1>
        <p>Discover products picked for your everyday life.</p>

        <a href="#products" className="shop-btn">
          Shop Now
        </a>
      </section>

      <section className="products-section" id="products">
        <h2>Our Products</h2>

        <div className="filters">
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
          />

          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="all">All Categories</option>

            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          <select
            value={sort}
            onChange={(e) => {
              setSort(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="default">Sort By</option>
            <option value="low">Price: Low to High</option>
            <option value="high">Price: High to Low</option>
          </select>
        </div>

        {loading && (
          <p className="message">Loading products...</p>
        )}

        {error && (
          <p className="message">Error: {error}</p>
        )}

        {!loading && !error && filteredProducts.length === 0 && (
          <p className="message">No products found.</p>
        )}

        <div className="product-grid">
          {!loading &&
            !error &&
            currentProducts.map((product) => (
              <div className="product-card" key={product.id}>
                <Link to={`/product/${product.id}`}>
                  <img
                    src={product.thumbnail}
                    alt={product.title}
                  />
                </Link>

                <div className="product-info">
                  <p className="category">{product.category}</p>

                  <Link
                    to={`/product/${product.id}`}
                    className="product-title"
                  >
                    <h3>{product.title}</h3>
                  </Link>

                  <p className="description">
                    {product.description}
                  </p>

                  <h3 className="price">
                    ${product.price}
                  </h3>

                  <button
                    onClick={() => dispatch(addToCart(product))}
                  >
                    Add to Cart
                  </button>

                  <button
                    onClick={() => dispatch(toggleWishlist(product))}
                  >
                    {wishlistItems.some(
                      (item) => item.id === product.id
                    )
                      ? "♥ Remove from Wishlist"
                      : "♡ Add to Wishlist"}
                  </button>
                </div>
              </div>
            ))}
        </div>

        {!loading && !error && totalPages > 1 && (
          <div className="pagination">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              Previous
            </button>

            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index + 1}
                className={
                  currentPage === index + 1 ? "active" : ""
                }
                onClick={() => setCurrentPage(index + 1)}
              >
                {index + 1}
              </button>
            ))}

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Next
            </button>
          </div>
        )}
      </section>

      <footer>
        <p>© 2026 Luma Store. Made with care.</p>
      </footer>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <MouseTrail />

      <Routes>
        <Route path="/" element={<Home />} />

        <Route
          path="/product/:id"
          element={<ProductDetails />}
        />

        <Route path="/cart" element={<Cart />} />

        <Route path="/wishlist" element={<Wishlist />} />

        <Route path="/checkout" element={<Checkout />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
