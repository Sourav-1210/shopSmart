import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiShoppingCart, FiUser, FiSearch, FiHeart, FiMenu, FiX } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);
  const { cartCount } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  return (
    <nav className="bg-flipkart-blue sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-2">
        <div className="flex items-center gap-4">
          {/* Logo */}
          <Link to="/" className="flex flex-col min-w-fit">
            <span className="text-white font-bold text-xl leading-tight italic">
              Shop<span className="text-flipkart-yellow">Smart</span>
            </span>
            <span className="text-flipkart-yellow text-[10px] italic font-medium">
              Explore <span className="underline">Plus</span> ✦
            </span>
          </Link>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex-1 max-w-2xl">
            <div className="flex items-center bg-white rounded overflow-hidden shadow-sm">
              <input
                type="text"
                placeholder="Search for products, brands and more"
                className="flex-1 px-4 py-2 text-sm outline-none text-gray-700"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                type="submit"
                className="bg-flipkart-blue px-4 py-2 text-white hover:bg-blue-700 transition-colors"
              >
                <FiSearch className="text-lg" />
              </button>
            </div>
          </form>

          {/* Desktop Nav Items */}
          <div className="hidden md:flex items-center gap-6 ml-4">
            {/* User */}
            <div className="relative group">
              <button className="flex items-center gap-1.5 text-white font-medium text-sm bg-white/10 hover:bg-white/20 px-4 py-1.5 rounded transition-colors">
                <FiUser className="text-base" />
                <span>{user?.name?.split(' ')[0] || 'Login'}</span>
                <span className="text-xs">▾</span>
              </button>
              <div className="absolute right-0 top-full mt-1 w-52 bg-white rounded shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="p-3 border-b">
                  <p className="text-sm font-semibold text-gray-800">{user?.name || 'Guest'}</p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
                <ul className="py-1">
                  <li>
                    <Link to="/orders" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-flipkart-gray transition-colors">
                      📦 My Orders
                    </Link>
                  </li>
                  <li>
                    <Link to="/wishlist" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-flipkart-gray transition-colors">
                      ❤️ Wishlist
                    </Link>
                  </li>
                  {user?.isDefault ? (
                    <li>
                      <Link to="/login" className="flex items-center gap-2 px-4 py-2 text-sm text-flipkart-blue font-medium hover:bg-flipkart-gray transition-colors">
                        🔐 Login / Signup
                      </Link>
                    </li>
                  ) : (
                    <li>
                      <button onClick={logout} className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-flipkart-gray transition-colors">
                        🚪 Logout
                      </button>
                    </li>
                  )}
                </ul>
              </div>
            </div>

            {/* Wishlist */}
            <Link to="/wishlist" className="flex items-center gap-1.5 text-white text-sm font-medium hover:text-flipkart-yellow transition-colors">
              <FiHeart className="text-base" />
              <span>Wishlist</span>
            </Link>

            {/* Cart */}
            <Link to="/cart" className="flex items-center gap-1.5 text-white text-sm font-medium hover:text-flipkart-yellow transition-colors relative">
              <div className="relative">
                <FiShoppingCart className="text-xl" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-flipkart-orange text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {cartCount > 9 ? '9+' : cartCount}
                  </span>
                )}
              </div>
              <span>Cart</span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-white ml-auto"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden mt-2 flex gap-4 pb-2">
            <Link to="/cart" onClick={() => setMobileOpen(false)} className="flex items-center gap-1 text-white text-sm">
              <FiShoppingCart /> Cart ({cartCount})
            </Link>
            <Link to="/wishlist" onClick={() => setMobileOpen(false)} className="flex items-center gap-1 text-white text-sm">
              <FiHeart /> Wishlist
            </Link>
            <Link to="/orders" onClick={() => setMobileOpen(false)} className="flex items-center gap-1 text-white text-sm">
              📦 Orders
            </Link>
            {user?.isDefault ? (
              <Link to="/login" onClick={() => setMobileOpen(false)} className="text-flipkart-yellow text-sm font-medium">
                Login
              </Link>
            ) : (
              <button onClick={logout} className="text-red-300 text-sm">Logout</button>
            )}
          </div>
        )}
      </div>

      {/* Sub-navbar: Category quick links */}
      <div className="hidden md:block bg-blue-700">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-6 py-1.5 overflow-x-auto">
            {['Mobiles', 'Laptops', 'Electronics', 'Fashion', 'Home & Furniture', 'Books', 'Sports', 'Grocery'].map((cat) => (
              <Link
                key={cat}
                to={`/search?category=${encodeURIComponent(cat)}`}
                className="text-white text-xs font-medium whitespace-nowrap hover:text-flipkart-yellow transition-colors"
              >
                {cat}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
