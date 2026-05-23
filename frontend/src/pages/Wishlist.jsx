import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toggleWishlist, getMe } from '../api/api';
import ProductCard from '../components/ProductCard';
import { FiHeart } from 'react-icons/fi';

const Wishlist = () => {
  const { user, wishlist, setWishlist } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.isDefault) return;
    if (wishlist.length === 0) {
      setProducts([]);
      return;
    }
    const fetchWishlist = async () => {
      setLoading(true);
      try {
        const { data } = await getMe();
        setProducts(data.wishlist || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchWishlist();
  }, [user, wishlist]);

  const handleToggleWishlist = async (productId) => {
    if (user?.isDefault) return;
    try {
      const { data } = await toggleWishlist(productId);
      setWishlist(data.wishlist);
      setProducts((prev) => prev.filter((p) => p._id !== productId));
    } catch (err) {
      console.error(err);
    }
  };

  if (user?.isDefault) {
    return (
      <div className="min-h-screen bg-flipkart-gray flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-sm p-12 text-center max-w-sm w-full mx-4">
          <FiHeart className="text-5xl text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-flipkart-darkgray mb-2">Login to view Wishlist</h2>
          <p className="text-flipkart-textgray text-sm mb-6">
            Save your favourite items to wishlist.
          </p>
          <Link
            to="/login"
            className="block bg-flipkart-blue text-white font-bold px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            Login Now
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-flipkart-gray">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <h1 className="text-xl font-bold text-flipkart-darkgray mb-4 flex items-center gap-2">
          <FiHeart className="text-red-500" /> My Wishlist
          {products.length > 0 && (
            <span className="text-sm text-flipkart-textgray font-normal">({products.length} items)</span>
          )}
        </h1>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-64 bg-white rounded-xl animate-pulse" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-16 text-center">
            <div className="text-6xl mb-4">💝</div>
            <h3 className="text-lg font-bold text-flipkart-darkgray mb-2">Your Wishlist is empty</h3>
            <p className="text-flipkart-textgray text-sm mb-6">Save items that you like in your wishlist.</p>
            <Link
              to="/search"
              className="bg-flipkart-blue text-white font-bold px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors text-sm inline-block"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {products.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                isWishlisted={true}
                onWishlistToggle={handleToggleWishlist}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
