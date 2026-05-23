import { Link } from 'react-router-dom';
import { FiHeart, FiStar } from 'react-icons/fi';
import { FaHeart } from 'react-icons/fa';
import { useCart } from '../context/CartContext';

const StarRating = ({ rating, count }) => {
  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center gap-0.5 bg-flipkart-green text-white text-xs font-semibold px-1.5 py-0.5 rounded">
        <span>{rating?.toFixed(1)}</span>
        <FiStar className="text-[10px] fill-white" />
      </div>
      {count && <span className="text-flipkart-textgray text-xs">({count?.toLocaleString()})</span>}
    </div>
  );
};

const ProductCard = ({ product, onWishlistToggle, isWishlisted }) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart(product);
  };

  return (
    <Link
      to={`/product/${product._id}`}
      className="bg-white rounded hover:shadow-lg transition-shadow duration-200 group flex flex-col overflow-hidden border border-gray-100"
    >
      {/* Product Image */}
      <div className="relative bg-flipkart-gray flex items-center justify-center h-52 overflow-hidden p-4">
        <img
          src={product.images?.[0] || 'https://picsum.photos/seed/product/500/500'}
          alt={product.name}
          className="h-44 object-contain group-hover:scale-105 transition-transform duration-300"
          onError={(e) => { e.target.onerror = null; e.target.src = 'https://picsum.photos/seed/product/500/500'; }}
        />
        {/* Discount Badge */}
        {product.discountPercent > 0 && (
          <div className="absolute top-2 left-2 bg-flipkart-orange text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
            {product.discountPercent}% OFF
          </div>
        )}
        {/* Wishlist Button */}
        {onWishlistToggle && (
          <button
            onClick={(e) => { e.preventDefault(); onWishlistToggle(product._id); }}
            className="absolute top-2 right-2 bg-white rounded-full p-1.5 shadow-sm hover:scale-110 transition-transform"
          >
            {isWishlisted ? (
              <FaHeart className="text-red-500 text-sm" />
            ) : (
              <FiHeart className="text-gray-400 text-sm" />
            )}
          </button>
        )}
      </div>

      {/* Product Info */}
      <div className="p-3 flex flex-col gap-1 flex-1">
        <h3 className="text-sm font-medium text-flipkart-darkgray line-clamp-2 leading-snug">
          {product.name}
        </h3>

        <StarRating rating={product.rating} count={product.reviewCount} />

        {/* Price row */}
        <div className="flex items-center gap-2 mt-1 flex-wrap">
          <span className="text-base font-bold text-flipkart-darkgray">
            ₹{product.price?.toLocaleString()}
          </span>
          {product.originalPrice > product.price && (
            <span className="text-flipkart-textgray text-xs line-through">
              ₹{product.originalPrice?.toLocaleString()}
            </span>
          )}
          {product.discountPercent > 0 && (
            <span className="text-flipkart-green text-xs font-semibold">
              {product.discountPercent}% off
            </span>
          )}
        </div>

        {/* Free delivery tag */}
        <p className="text-[11px] text-flipkart-textgray mt-auto pt-1">
          {product.price > 500 ? '✓ Free Delivery' : '₹40 Delivery'}
        </p>
      </div>
    </Link>
  );
};

export default ProductCard;
