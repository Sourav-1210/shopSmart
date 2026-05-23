import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductById } from '../api/api';
import { useCart } from '../context/CartContext';
import { FiStar, FiShield, FiTruck, FiRefreshCw, FiHeart } from 'react-icons/fi';
import { FaHeart, FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';
import { toast } from 'react-toastify';

const StarDisplay = ({ rating }) => {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => {
        if (rating >= star) return <FaStar key={star} className="text-flipkart-yellow text-base" />;
        if (rating >= star - 0.5) return <FaStarHalfAlt key={star} className="text-flipkart-yellow text-base" />;
        return <FaRegStar key={star} className="text-gray-300 text-base" />;
      })}
    </div>
  );
};

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [wishlisted, setWishlisted] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const { data } = await getProductById(id);
        setProduct(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    addToCart(product);
  };

  const handleBuyNow = () => {
    addToCart(product);
    navigate('/cart');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-flipkart-gray">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="bg-white rounded-xl shadow-sm p-6 animate-pulse">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="w-full md:w-80 h-80 bg-flipkart-gray rounded-xl" />
              <div className="flex-1 space-y-4">
                <div className="h-6 bg-flipkart-gray rounded w-3/4" />
                <div className="h-4 bg-flipkart-gray rounded w-1/4" />
                <div className="h-8 bg-flipkart-gray rounded w-1/3" />
                <div className="h-4 bg-flipkart-gray rounded w-full" />
                <div className="h-4 bg-flipkart-gray rounded w-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-flipkart-gray flex items-center justify-center">
        <div className="text-center">
          <p className="text-4xl mb-2">😕</p>
          <h2 className="text-xl font-bold">Product not found</h2>
        </div>
      </div>
    );
  }

  const specs = product.specifications
    ? Object.entries(Object.fromEntries ? Object.fromEntries(Object.entries(product.specifications)) : product.specifications)
    : [];

  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 5);
  const deliveryStr = deliveryDate.toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' });

  return (
    <div className="min-h-screen bg-flipkart-gray">
      <div className="max-w-7xl mx-auto px-4 py-4">
        {/* Breadcrumb */}
        <nav className="text-xs text-flipkart-textgray mb-3 flex items-center gap-1">
          <button onClick={() => navigate('/')} className="hover:text-flipkart-blue transition-colors">Home</button>
          <span>/</span>
          <button onClick={() => navigate(`/search?category=${product.category}`)} className="hover:text-flipkart-blue transition-colors">{product.category}</button>
          <span>/</span>
          <span className="text-flipkart-darkgray line-clamp-1">{product.name}</span>
        </nav>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="flex flex-col md:flex-row">
            {/* Left: Image Gallery */}
            <div className="md:w-80 lg:w-96 flex-shrink-0 p-6 border-r border-gray-100">
              {/* Main Image */}
              <div className="bg-flipkart-gray rounded-xl flex items-center justify-center h-72 mb-4 overflow-hidden">
                <img
                  src={product.images?.[selectedImage] || 'https://picsum.photos/seed/product/500/500'}
                  alt={product.name}
                  className="h-64 object-contain transition-all duration-300"
                  onError={(e) => { e.target.src = 'https://picsum.photos/seed/product/500/500'; }}
                />
              </div>
              {/* Thumbnail strip */}
              {product.images?.length > 1 && (
                <div className="flex gap-2 justify-center flex-wrap">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={`w-14 h-14 rounded-lg border-2 flex items-center justify-center overflow-hidden bg-flipkart-gray transition-all ${selectedImage === idx ? 'border-flipkart-blue' : 'border-transparent hover:border-gray-300'}`}
                    >
                      <img src={img} alt="" className="h-12 object-contain" onError={(e) => { e.target.src = 'https://picsum.photos/seed/product/500/500'; }} />
                    </button>
                  ))}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-flipkart-yellow text-flipkart-darkgray font-bold py-3 rounded-lg hover:bg-yellow-400 transition-colors text-sm shadow-md"
                >
                  🛒 Add to Cart
                </button>
                <button
                  onClick={handleBuyNow}
                  className="flex-1 bg-flipkart-orange text-white font-bold py-3 rounded-lg hover:bg-orange-600 transition-colors text-sm shadow-md"
                >
                  ⚡ Buy Now
                </button>
              </div>
            </div>

            {/* Right: Product Info */}
            <div className="flex-1 p-6">
              {/* Title & Wishlist */}
              <div className="flex items-start justify-between gap-4">
                <h1 className="text-xl font-semibold text-flipkart-darkgray leading-snug flex-1">{product.name}</h1>
                <button
                  onClick={() => setWishlisted(!wishlisted)}
                  className="text-2xl flex-shrink-0 hover:scale-110 transition-transform"
                >
                  {wishlisted ? <FaHeart className="text-red-500" /> : <FiHeart className="text-gray-400" />}
                </button>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center gap-1 bg-flipkart-green text-white text-sm font-bold px-2 py-0.5 rounded">
                  {product.rating?.toFixed(1)} <FiStar className="text-xs" />
                </div>
                <span className="text-flipkart-textgray text-sm">
                  {product.reviewCount?.toLocaleString()} Ratings & Reviews
                </span>
              </div>

              {/* Flipkart Assured */}
              <div className="mt-2">
                <span className="text-xs text-flipkart-blue font-semibold bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                  ✓ Flipkart Assured
                </span>
              </div>

              {/* Price Block */}
              <div className="mt-4 pb-4 border-b border-gray-100">
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-bold text-flipkart-darkgray">
                    ₹{product.price?.toLocaleString()}
                  </span>
                  {product.originalPrice > product.price && (
                    <>
                      <span className="text-flipkart-textgray line-through text-lg">
                        ₹{product.originalPrice?.toLocaleString()}
                      </span>
                      <span className="text-flipkart-green text-lg font-semibold">
                        {product.discountPercent}% off
                      </span>
                    </>
                  )}
                </div>
                <p className="text-xs text-flipkart-textgray mt-1">Inclusive of all taxes</p>
              </div>

              {/* Stock & Delivery */}
              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2">
                  <div className={`w-2.5 h-2.5 rounded-full ${product.stock > 0 ? 'bg-flipkart-green' : 'bg-red-500'}`} />
                  <span className={`text-sm font-semibold ${product.stock > 0 ? 'text-flipkart-green' : 'text-red-500'}`}>
                    {product.stock > 10 ? 'In Stock' : product.stock > 0 ? `Only ${product.stock} left!` : 'Out of Stock'}
                  </span>
                </div>
                {product.stock > 0 && (
                  <p className="text-sm text-gray-600">
                    <FiTruck className="inline mr-1 text-flipkart-blue" />
                    <span className="font-medium text-flipkart-green">
                      {product.price > 500 ? 'Free' : '₹40'}
                    </span> Delivery by <span className="font-semibold">{deliveryStr}</span>
                  </p>
                )}
              </div>

              {/* Offers */}
              <div className="mt-4 pb-4 border-b border-gray-100">
                <h3 className="text-sm font-bold text-flipkart-darkgray mb-2">Available Offers</h3>
                <ul className="space-y-1.5">
                  <li className="text-xs text-gray-600 flex items-start gap-1.5">
                    <span className="text-flipkart-green font-bold mt-0.5">✓</span>
                    <span><strong>Bank Offer</strong>: 10% off on HDFC Credit Cards. Min. transaction ₹5,000.</span>
                  </li>
                  <li className="text-xs text-gray-600 flex items-start gap-1.5">
                    <span className="text-flipkart-green font-bold mt-0.5">✓</span>
                    <span><strong>EMI</strong> starting from ₹{Math.round(product.price / 12).toLocaleString()}/month</span>
                  </li>
                  <li className="text-xs text-gray-600 flex items-start gap-1.5">
                    <span className="text-flipkart-green font-bold mt-0.5">✓</span>
                    <span><strong>No Cost EMI</strong> available on select cards</span>
                  </li>
                </ul>
              </div>

              {/* Description */}
              <div className="mt-4 pb-4 border-b border-gray-100">
                <h3 className="text-sm font-bold text-flipkart-darkgray mb-2">Product Description</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{product.description}</p>
              </div>

              {/* Specifications */}
              {specs.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-sm font-bold text-flipkart-darkgray mb-2">Specifications</h3>
                  <table className="w-full text-sm">
                    <tbody>
                      {specs.map(([key, val]) => (
                        <tr key={key} className="border-b border-gray-50 last:border-0">
                          <td className="py-1.5 pr-4 text-flipkart-textgray w-36 font-medium">{key}</td>
                          <td className="py-1.5 text-flipkart-darkgray">{val}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Trust badges */}
              <div className="mt-6 grid grid-cols-3 gap-3">
                {[
                  { icon: <FiShield />, text: '1 Year Warranty' },
                  { icon: <FiTruck />, text: 'Fast Delivery' },
                  { icon: <FiRefreshCw />, text: '7 Day Return' },
                ].map((badge) => (
                  <div key={badge.text} className="flex flex-col items-center gap-1 bg-flipkart-gray rounded-lg p-3 text-center">
                    <span className="text-flipkart-blue text-xl">{badge.icon}</span>
                    <span className="text-xs text-gray-600 font-medium">{badge.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
