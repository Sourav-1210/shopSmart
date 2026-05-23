import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { FiTrash2, FiMinus, FiPlus, FiShoppingBag } from 'react-icons/fi';

const Cart = () => {
  const { items, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();

  const shippingCost = cartTotal > 500 ? 0 : 40;
  const totalWithShipping = cartTotal + shippingCost;
  const totalDiscount = items.reduce(
    (acc, item) => acc + ((item.originalPrice || item.price) - item.price) * item.quantity,
    0
  );

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-flipkart-gray flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-sm p-16 text-center max-w-sm w-full mx-4">
          <div className="text-7xl mb-4">🛒</div>
          <h2 className="text-xl font-bold text-flipkart-darkgray mb-2">Your cart is empty!</h2>
          <p className="text-flipkart-textgray text-sm mb-6">Add items to it now.</p>
          <button
            onClick={() => navigate('/search')}
            className="bg-flipkart-blue text-white font-semibold px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors w-full"
          >
            Shop Now
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-flipkart-gray">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Cart Items */}
          <div className="flex-1">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              {/* Header */}
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <h1 className="text-lg font-bold text-flipkart-darkgray">
                  My Cart ({items.length} {items.length === 1 ? 'item' : 'items'})
                </h1>
                <button
                  onClick={clearCart}
                  className="text-sm text-red-500 hover:underline flex items-center gap-1"
                >
                  <FiTrash2 size={14} /> Clear Cart
                </button>
              </div>

              {/* Items */}
              {items.map((item) => (
                <div key={item._id} className="flex items-start gap-4 px-6 py-5 border-b border-gray-50 hover:bg-flipkart-gray/40 transition-colors">
                  {/* Image */}
                  <div className="w-24 h-24 bg-flipkart-gray rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                    <img
                      src={item.images?.[0] || 'https://picsum.photos/seed/product/500/500'}
                      alt={item.name}
                      className="h-20 object-contain"
                      onError={(e) => { e.target.src = 'https://picsum.photos/seed/product/500/500'; }}
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-flipkart-darkgray line-clamp-2">{item.name}</h3>
                    <p className="text-xs text-flipkart-textgray mt-0.5">{item.brand}</p>

                    {/* Price */}
                    <div className="flex items-center gap-2 mt-2">
                      <span className="font-bold text-flipkart-darkgray">₹{item.price?.toLocaleString()}</span>
                      {item.originalPrice > item.price && (
                        <>
                          <span className="text-flipkart-textgray text-sm line-through">₹{item.originalPrice?.toLocaleString()}</span>
                          <span className="text-flipkart-green text-sm font-semibold">{item.discountPercent}% off</span>
                        </>
                      )}
                    </div>

                    {/* Delivery */}
                    <p className="text-xs text-flipkart-textgray mt-1">
                      Delivery: <span className="font-medium text-flipkart-green">{item.price > 500 ? 'Free' : '₹40'}</span>
                    </p>
                  </div>

                  {/* Qty Controls & Remove */}
                  <div className="flex flex-col items-end gap-3">
                    <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                      <button
                        onClick={() => updateQuantity(item._id, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center bg-flipkart-gray hover:bg-gray-200 transition-colors text-flipkart-darkgray"
                      >
                        <FiMinus size={14} />
                      </button>
                      <span className="w-10 h-8 flex items-center justify-center text-sm font-semibold bg-white">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item._id, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center bg-flipkart-gray hover:bg-gray-200 transition-colors text-flipkart-darkgray"
                      >
                        <FiPlus size={14} />
                      </button>
                    </div>
                    <button
                      onClick={() => removeFromCart(item._id)}
                      className="text-xs text-red-500 hover:underline flex items-center gap-1"
                    >
                      <FiTrash2 size={12} /> Remove
                    </button>
                  </div>
                </div>
              ))}

              {/* Footer total */}
              <div className="px-6 py-4 flex justify-end">
                <button
                  onClick={() => navigate('/checkout')}
                  className="bg-flipkart-orange text-white font-bold px-12 py-3.5 rounded-lg hover:bg-orange-600 transition-colors shadow-md text-sm"
                >
                  Place Order →
                </button>
              </div>
            </div>
          </div>

          {/* Price Summary */}
          <div className="md:w-80 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden sticky top-24">
              <div className="bg-flipkart-gray px-5 py-3 border-b border-gray-200">
                <h2 className="text-xs font-bold text-flipkart-textgray uppercase tracking-wider">Price Details</h2>
              </div>
              <div className="px-5 py-4 space-y-3">
                <div className="flex justify-between text-sm text-flipkart-darkgray">
                  <span>Price ({items.length} item{items.length > 1 ? 's' : ''})</span>
                  <span>₹{items.reduce((sum, i) => sum + (i.originalPrice || i.price) * i.quantity, 0).toLocaleString()}</span>
                </div>
                {totalDiscount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-flipkart-darkgray">Discount</span>
                    <span className="text-flipkart-green font-semibold">- ₹{totalDiscount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm text-flipkart-darkgray">
                  <span>Delivery Charges</span>
                  <span className={shippingCost === 0 ? 'text-flipkart-green font-medium' : ''}>
                    {shippingCost === 0 ? '✓ Free' : `₹${shippingCost}`}
                  </span>
                </div>
                <div className="border-t border-dashed border-gray-200 pt-3">
                  <div className="flex justify-between font-bold text-base text-flipkart-darkgray">
                    <span>Total Amount</span>
                    <span>₹{totalWithShipping.toLocaleString()}</span>
                  </div>
                </div>
                {totalDiscount > 0 && (
                  <p className="text-flipkart-green text-sm font-semibold text-center pt-1">
                    🎉 You will save ₹{totalDiscount.toLocaleString()} on this order!
                  </p>
                )}
              </div>
              <div className="px-5 pb-5">
                <button
                  onClick={() => navigate('/checkout')}
                  className="w-full bg-flipkart-orange text-white font-bold py-3.5 rounded-lg hover:bg-orange-600 transition-colors shadow-md text-sm"
                >
                  Proceed to Checkout →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
