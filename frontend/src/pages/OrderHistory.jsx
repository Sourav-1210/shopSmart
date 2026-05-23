import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getMyOrders } from '../api/api';
import { useAuth } from '../context/AuthContext';
import { FiPackage, FiChevronRight, FiAlertCircle } from 'react-icons/fi';

const STATUS_COLORS = {
  Pending: 'bg-yellow-100 text-yellow-700',
  Processing: 'bg-blue-100 text-blue-700',
  Shipped: 'bg-purple-100 text-purple-700',
  Delivered: 'bg-green-100 text-green-700',
  Cancelled: 'bg-red-100 text-red-700',
};

const OrderHistory = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.isDefault) return setLoading(false);
    const fetchOrders = async () => {
      try {
        const { data } = await getMyOrders();
        setOrders(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [user]);

  if (user?.isDefault) {
    return (
      <div className="min-h-screen bg-flipkart-gray flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-sm p-12 text-center max-w-sm w-full mx-4">
          <FiAlertCircle className="text-5xl text-flipkart-blue mx-auto mb-4" />
          <h2 className="text-xl font-bold text-flipkart-darkgray mb-2">Login to view Orders</h2>
          <p className="text-flipkart-textgray text-sm mb-6">
            Please login with your account to see your order history.
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
      <div className="max-w-4xl mx-auto px-4 py-6">
        <h1 className="text-xl font-bold text-flipkart-darkgray mb-4 flex items-center gap-2">
          <FiPackage className="text-flipkart-blue" /> My Orders
        </h1>

        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl h-32 animate-pulse shadow-sm" />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-16 text-center">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-lg font-bold text-flipkart-darkgray mb-2">No orders yet</h3>
            <p className="text-flipkart-textgray text-sm mb-6">Start shopping to see your orders here.</p>
            <Link
              to="/search"
              className="bg-flipkart-blue text-white font-bold px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors text-sm inline-block"
            >
              Shop Now
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order._id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                {/* Order Header */}
                <div className="bg-flipkart-gray px-5 py-3 flex flex-wrap items-center justify-between gap-2 border-b border-gray-200">
                  <div className="flex items-center gap-4 text-xs text-flipkart-textgray">
                    <div>
                      <span className="uppercase tracking-wide font-semibold">Order ID</span>
                      <p className="font-bold text-flipkart-darkgray font-mono text-sm">{order.orderId}</p>
                    </div>
                    <div>
                      <span className="uppercase tracking-wide font-semibold">Placed On</span>
                      <p className="font-semibold text-flipkart-darkgray">
                        {new Date(order.placedAt || order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                    <div>
                      <span className="uppercase tracking-wide font-semibold">Total</span>
                      <p className="font-bold text-flipkart-darkgray">₹{order.totalPrice?.toLocaleString()}</p>
                    </div>
                  </div>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-700'}`}>
                    {order.status}
                  </span>
                </div>

                {/* Order Items */}
                <div className="px-5 py-4">
                  {order.items?.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-4 py-2 border-b border-gray-50 last:border-0">
                      <div className="w-16 h-16 bg-flipkart-gray rounded flex items-center justify-center flex-shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-14 object-contain"
                          onError={(e) => { e.target.src = 'https://picsum.photos/seed/product/500/500'; }}
                        />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-flipkart-darkgray line-clamp-1">{item.name}</p>
                        <p className="text-xs text-flipkart-textgray">Qty: {item.quantity} × ₹{item.price?.toLocaleString()}</p>
                      </div>
                      <span className="text-sm font-bold text-flipkart-darkgray">
                        ₹{(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>

                {/* View Details */}
                <div className="px-5 py-3 bg-flipkart-gray border-t border-gray-100 flex justify-end">
                  <Link
                    to={`/order-success/${order.orderId}`}
                    className="flex items-center gap-1 text-flipkart-blue text-sm font-semibold hover:underline"
                  >
                    View Details <FiChevronRight />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistory;
