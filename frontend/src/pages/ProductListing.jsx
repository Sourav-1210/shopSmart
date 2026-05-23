import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getProducts, getCategories } from '../api/api';
import ProductCard from '../components/ProductCard';
import { FiFilter, FiX } from 'react-icons/fi';

const SORT_OPTIONS = [
  { label: 'Relevance', value: '' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
  { label: 'Highest Rated', value: 'rating' },
  { label: 'Best Discount', value: 'discount' },
];

const PRICE_RANGES = [
  { label: 'Under ₹500', min: 0, max: 500 },
  { label: '₹500 – ₹1,000', min: 500, max: 1000 },
  { label: '₹1,000 – ₹5,000', min: 1000, max: 5000 },
  { label: '₹5,000 – ₹20,000', min: 5000, max: 20000 },
  { label: '₹20,000 – ₹50,000', min: 20000, max: 50000 },
  { label: 'Above ₹50,000', min: 50000, max: 999999 },
];

const ProductListing = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategoriesList] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showFilter, setShowFilter] = useState(false);

  const search = searchParams.get('q') || '';
  const category = searchParams.get('category') || '';
  const sort = searchParams.get('sort') || '';
  const [selectedCategory, setSelectedCategory] = useState(category);
  const [selectedSort, setSelectedSort] = useState(sort);
  const [selectedPriceRange, setSelectedPriceRange] = useState(null);

  useEffect(() => {
    setSelectedCategory(searchParams.get('category') || '');
    setSelectedSort(searchParams.get('sort') || '');
  }, [searchParams]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await getCategories();
        setCategoriesList(data);
      } catch (err) { console.error(err); }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = { search, category: selectedCategory, sort: selectedSort, limit: 40 };
        if (selectedPriceRange) {
          params.minPrice = selectedPriceRange.min;
          params.maxPrice = selectedPriceRange.max;
        }
        const { data } = await getProducts(params);
        setProducts(data.products);
        setTotal(data.total);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchProducts();
  }, [search, selectedCategory, selectedSort, selectedPriceRange]);

  const updateFilter = (key, value) => {
    const params = Object.fromEntries(searchParams.entries());
    if (value) params[key] = value;
    else delete params[key];
    setSearchParams(params);
  };

  const FilterSidebar = () => (
    <div className="bg-white rounded-xl shadow-sm p-4 w-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-flipkart-darkgray text-sm uppercase tracking-wide">Filters</h3>
        {(selectedCategory || selectedPriceRange) && (
          <button
            onClick={() => { setSelectedCategory(''); setSelectedPriceRange(null); updateFilter('category', ''); }}
            className="text-flipkart-blue text-xs hover:underline"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Category */}
      <div className="mb-5">
        <h4 className="text-xs font-bold text-gray-500 uppercase mb-2 tracking-wider">Category</h4>
        <ul className="space-y-1.5">
          {categories.map((cat) => (
            <li key={cat}>
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={selectedCategory === cat}
                  onChange={() => {
                    const val = selectedCategory === cat ? '' : cat;
                    setSelectedCategory(val);
                    updateFilter('category', val);
                  }}
                  className="accent-flipkart-blue w-3.5 h-3.5 cursor-pointer"
                />
                <span className={`text-sm group-hover:text-flipkart-blue transition-colors ${selectedCategory === cat ? 'text-flipkart-blue font-semibold' : 'text-gray-700'}`}>
                  {cat}
                </span>
              </label>
            </li>
          ))}
        </ul>
      </div>

      {/* Price Range */}
      <div>
        <h4 className="text-xs font-bold text-gray-500 uppercase mb-2 tracking-wider">Price Range</h4>
        <ul className="space-y-1.5">
          {PRICE_RANGES.map((range) => (
            <li key={range.label}>
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="radio"
                  name="price"
                  checked={selectedPriceRange?.label === range.label}
                  onChange={() => setSelectedPriceRange(range)}
                  className="accent-flipkart-blue cursor-pointer"
                />
                <span className={`text-sm group-hover:text-flipkart-blue transition-colors ${selectedPriceRange?.label === range.label ? 'text-flipkart-blue font-semibold' : 'text-gray-700'}`}>
                  {range.label}
                </span>
              </label>
            </li>
          ))}
          {selectedPriceRange && (
            <button onClick={() => setSelectedPriceRange(null)} className="text-xs text-red-500 hover:underline mt-1">
              Clear Price Filter
            </button>
          )}
        </ul>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-flipkart-gray">
      <div className="max-w-7xl mx-auto px-4 py-4">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm px-5 py-3 mb-4 flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="font-bold text-flipkart-darkgray text-base">
              {search ? `Results for "${search}"` : selectedCategory || 'All Products'}
            </h1>
            <p className="text-flipkart-textgray text-xs">{total} results found</p>
          </div>
          <div className="flex items-center gap-3">
            {/* Sort */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 font-medium">Sort by:</span>
              <select
                value={selectedSort}
                onChange={(e) => { setSelectedSort(e.target.value); updateFilter('sort', e.target.value); }}
                className="text-sm border border-gray-200 rounded px-2 py-1.5 outline-none focus:border-flipkart-blue cursor-pointer"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setShowFilter(!showFilter)}
              className="md:hidden flex items-center gap-1 text-sm text-flipkart-blue border border-flipkart-blue px-3 py-1.5 rounded"
            >
              <FiFilter size={14} /> Filters
            </button>
          </div>
        </div>

        <div className="flex gap-4">
          {/* Desktop Sidebar */}
          <div className="hidden md:block w-60 flex-shrink-0">
            <FilterSidebar />
          </div>

          {/* Mobile Sidebar Overlay */}
          {showFilter && (
            <div className="fixed inset-0 z-50 md:hidden">
              <div className="absolute inset-0 bg-black/40" onClick={() => setShowFilter(false)} />
              <div className="absolute left-0 top-0 bottom-0 w-72 bg-white overflow-y-auto p-4 shadow-xl">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-lg">Filters</h3>
                  <button onClick={() => setShowFilter(false)}><FiX size={20} /></button>
                </div>
                <FilterSidebar />
              </div>
            </div>
          )}

          {/* Products Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {[...Array(12)].map((_, i) => (
                  <div key={i} className="h-64 bg-white rounded-xl animate-pulse" />
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="bg-white rounded-xl p-16 text-center shadow-sm">
                <p className="text-4xl mb-3">🔍</p>
                <h3 className="font-bold text-lg text-flipkart-darkgray">No products found</h3>
                <p className="text-flipkart-textgray text-sm mt-1">Try different keywords or filters</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductListing;
