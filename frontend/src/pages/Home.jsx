import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFeaturedProducts, getProducts } from '../api/api';
import ProductCard from '../components/ProductCard';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const banners = [
  {
    id: 1,
    bg: 'from-blue-600 to-blue-800',
    title: 'Big Billion Days Sale',
    subtitle: 'Up to 80% off on Electronics',
    tag: 'SALE LIVE',
    emoji: '🎉',
  },
  {
    id: 2,
    bg: 'from-orange-500 to-red-600',
    title: 'Fashion Mega Sale',
    subtitle: 'Flat 50% off on Top Brands',
    tag: 'NEW ARRIVALS',
    emoji: '👗',
  },
  {
    id: 3,
    bg: 'from-green-600 to-teal-700',
    title: 'Mobile Bonanza',
    subtitle: 'Best Smartphones at Lowest Prices',
    tag: 'HOT DEALS',
    emoji: '📱',
  },
];

const categories = [
  { name: 'Mobiles', image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=120&h=120&fit=crop&auto=format&q=80' },
  { name: 'Laptops', image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=120&h=120&fit=crop&auto=format&q=80' },
  { name: 'Electronics', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=120&h=120&fit=crop&auto=format&q=80' },
  { name: 'Fashion', image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=120&h=120&fit=crop&auto=format&q=80' },
  { name: 'Home & Furniture', image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=120&h=120&fit=crop&auto=format&q=80' },
  { name: 'Books', image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=120&h=120&fit=crop&auto=format&q=80' },
  { name: 'Sports', image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=120&h=120&fit=crop&auto=format&q=80' },
  { name: 'Grocery', image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=120&h=120&fit=crop&auto=format&q=80' },
];

const Home = () => {
  const [currentBanner, setCurrentBanner] = useState(0);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [featured, all] = await Promise.all([
          getFeaturedProducts(),
          getProducts({ limit: 20, sort: 'rating' }),
        ]);
        setFeaturedProducts(featured.data);
        setAllProducts(all.data.products);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Auto-slide banner
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const prevBanner = () => setCurrentBanner((p) => (p - 1 + banners.length) % banners.length);
  const nextBanner = () => setCurrentBanner((p) => (p + 1) % banners.length);

  return (
    <div className="min-h-screen bg-flipkart-gray">
      {/* Hero Banner */}
      <div className="max-w-7xl mx-auto px-4 pt-4">
        <div className="relative rounded-xl overflow-hidden h-52 md:h-72 shadow-md">
          {banners.map((banner, idx) => (
            <div
              key={banner.id}
              className={`absolute inset-0 bg-gradient-to-r ${banner.bg} flex items-center px-10 md:px-16 transition-opacity duration-700 ${idx === currentBanner ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            >
              <div>
                <span className="bg-flipkart-yellow text-flipkart-darkgray text-xs font-bold px-2 py-0.5 rounded mb-3 inline-block">
                  {banner.tag}
                </span>
                <h1 className="text-3xl md:text-5xl font-bold text-white mb-2">
                  {banner.emoji} {banner.title}
                </h1>
                <p className="text-white/90 text-lg md:text-xl">{banner.subtitle}</p>
                <button
                  onClick={() => navigate('/search')}
                  className="mt-4 bg-white text-flipkart-blue font-semibold px-6 py-2 rounded-full hover:bg-flipkart-yellow hover:text-flipkart-darkgray transition-colors text-sm"
                >
                  Shop Now →
                </button>
              </div>
            </div>
          ))}

          {/* Banner Controls */}
          <button onClick={prevBanner} className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full p-1.5 transition-colors">
            <FiChevronLeft size={20} />
          </button>
          <button onClick={nextBanner} className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full p-1.5 transition-colors">
            <FiChevronRight size={20} />
          </button>

          {/* Dots */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
            {banners.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentBanner(idx)}
                className={`w-2 h-2 rounded-full transition-all ${idx === currentBanner ? 'bg-white w-5' : 'bg-white/50'}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="max-w-7xl mx-auto px-4 mt-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-bold text-flipkart-darkgray mb-4">Shop by Category</h2>
          <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
            {categories.map((cat) => (
              <button
                key={cat.name}
                onClick={() => navigate(`/search?category=${encodeURIComponent(cat.name)}`)}
                className="flex flex-col items-center gap-2 group cursor-pointer"
              >
                <div className="w-16 h-16 rounded-full overflow-hidden flex items-center justify-center bg-gray-50 group-hover:scale-110 transition-transform shadow-md border border-gray-100">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-xs font-semibold text-center text-flipkart-darkgray group-hover:text-flipkart-blue transition-colors">
                  {cat.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Deal of the Day Banner */}
      <div className="max-w-7xl mx-auto px-4 mt-4">
        <div className="bg-gradient-to-r from-flipkart-blue to-blue-700 rounded-xl p-5 flex flex-col md:flex-row items-center justify-between shadow-md">
          <div>
            <span className="text-flipkart-yellow text-sm font-bold">⚡ DEAL OF THE DAY</span>
            <h3 className="text-white text-xl font-bold mt-1">Up to 70% Off — Limited Time!</h3>
            <p className="text-white/80 text-sm">On Electronics, Mobiles & Laptops</p>
          </div>
          <button
            onClick={() => navigate('/search?sort=discount')}
            className="mt-3 md:mt-0 bg-flipkart-yellow text-flipkart-darkgray font-bold px-6 py-2.5 rounded-full hover:bg-yellow-300 transition-colors text-sm"
          >
            Grab Now →
          </button>
        </div>
      </div>

      {/* Featured Products */}
      <div className="max-w-7xl mx-auto px-4 mt-6 pb-10">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-flipkart-darkgray">🔥 Featured Products</h2>
              <div className="h-0.5 w-16 bg-flipkart-orange mt-1 rounded" />
            </div>
            <button
              onClick={() => navigate('/search')}
              className="text-flipkart-blue text-sm font-medium hover:underline"
            >
              View All →
            </button>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-64 bg-flipkart-gray rounded animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {featuredProducts.slice(0, 10).map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>

        {/* All Products */}
        <div className="bg-white rounded-xl shadow-sm p-6 mt-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-flipkart-darkgray">⭐ Top Rated Products</h2>
              <div className="h-0.5 w-16 bg-flipkart-blue mt-1 rounded" />
            </div>
            <button
              onClick={() => navigate('/search?sort=rating')}
              className="text-flipkart-blue text-sm font-medium hover:underline"
            >
              View All →
            </button>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-64 bg-flipkart-gray rounded animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {allProducts.slice(0, 10).map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
