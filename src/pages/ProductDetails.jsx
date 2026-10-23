
import { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../redux/productSlice";
import { addToCart } from "../redux/cartSlice";
import { ThemeContext } from "../ThemeContext";
import "../App.css";

function ProductDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { darkMode } = useContext(ThemeContext);

  const { products, loading, error } = useSelector(
    (state) => state.products
  );

  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState("");

  useEffect(() => {
    if (products.length === 0) {
      dispatch(fetchProducts());
    }
  }, [dispatch, products.length]);

  const product = products.find(
    (item) => item.id === Number(id)
  );

  useEffect(() => {
    if (product) {
      setSelectedImage(product.thumbnail);
      setQuantity(1);
    }
  }, [product]);

  function handleAddToCart() {
    for (let i = 0; i < quantity; i++) {
      dispatch(addToCart(product));
    }
  }

  if (loading && !product) {
    return <div className="details-message">Loading product...</div>;
  }

  if (error && !product) {
    return (
      <div className="details-message">
        <h2>Unable to load product</h2>
        <p>{error}</p>
        <Link to="/">Back to Shop</Link>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="details-message">
        <h2>Product not found</h2>
        <Link to="/">Back to Shop</Link>
      </div>
    );
  }

  const images = product.images?.length
    ? product.images
    : [product.thumbnail];

  return (
    <section
      className={
        darkMode
          ? "product-details-section dark-mode"
          : "product-details-section"
      }
    >
      <Link to="/" className="details-back">
        ← Back to Shop
      </Link>

      <div className="product-details">
        <div className="details-gallery">
          <img
            className="main-product-image"
            src={selectedImage || product.thumbnail}
            alt={product.title}
          />

          <div className="thumbnail-gallery">
            {images.map((image, index) => (
              <button
                className={
                  selectedImage === image
                    ? "thumbnail active-thumbnail"
                    : "thumbnail"
                }
                key={image + index}
                onClick={() => setSelectedImage(image)}
              >
                <img src={image} alt={product.title} />
              </button>
            ))}
          </div>
        </div>

        <div className="details-info">
          <p className="details-category">{product.category}</p>

          <h1>{product.title}</h1>

          <p className="details-rating">
            ⭐ {product.rating} / 5
          </p>

          <h2 className="details-price">
            ${product.price.toFixed(2)}
          </h2>

          <p className="details-description">
            {product.description}
          </p>

          <p>
            <strong>Brand:</strong> {product.brand || "N/A"}
          </p>

          <p>
            <strong>Available stock:</strong> {product.stock}
          </p>

          <div className="quantity-section">
            <span>Quantity:</span>

            <div className="quantity-selector">
              <button
                onClick={() => setQuantity(quantity - 1)}
                disabled={quantity <= 1}
              >
                -
              </button>

              <span>{quantity}</span>

              <button
                onClick={() => setQuantity(quantity + 1)}
                disabled={quantity >= product.stock}
              >
                +
              </button>
            </div>
          </div>

          <h3 className="details-subtotal">
            Subtotal: ${(product.price * quantity).toFixed(2)}
          </h3>

          <button
            className="details-add-button"
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
          >
            {product.stock <= 0
              ? "Out of Stock"
              : "Add to Cart"}
          </button>
        </div>
      </div>
    </section>
  );
}

export default ProductDetails;
