import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getOrderById } from '../api/api';
import { FiCheckCircle, FiPackage, FiTruck, FiHome, FiCopy } from 'react-icons/fi';

const OrderSuccess = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await getOrderById(orderId);
        setOrder(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId]);

  const copyOrderId = () => {
    navigator.clipboard.writeText(orderId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const deliveryDate = order?.deliveryDate
    ? new Date(order.deliveryDate).toLocaleDateString('en-IN', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
    : null;

  const steps = [
    { icon: <FiCheckCircle />, label: 'Order Placed', done: true },
    { icon: <FiPackage />, label: 'Processing', done: false },
    { icon: <FiTruck />, label: 'Shipped', done: false },
    { icon: <FiHome />, label: 'Delivered', done: false },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-flipkart-gray flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <div className="w-16 h-16 border-4 border-flipkart-blue border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Loading order details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-flipkart-gray py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Success Card */}
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          {/* Green Header */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-8 py-10 text-center">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiCheckCircle className="text-white text-4xl" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-1">Order Placed Successfully!</h1>
            <p className="text-white/90 text-sm">
              Thank you for shopping with <strong>ShopSmart</strong>! Your order has been confirmed.
            </p>
          </div>

          {/* Order ID */}
          <div className="px-8 py-5 bg-green-50 border-b border-green-100">
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <div>
                <p className="text-xs text-gray-500 text-center">Order ID</p>
                <p className="font-bold text-flipkart-darkgray text-sm font-mono">{orderId}</p>
              </div>
              <button
                onClick={copyOrderId}
                className="flex items-center gap-1 text-xs bg-white border border-gray-200 px-2 py-1 rounded hover:bg-gray-50 transition-colors"
              >
                <FiCopy size={12} />
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>

          {/* Tracking Steps */}
          <div className="px-8 py-6 border-b border-gray-100">
            <h3 className="text-sm font-bold text-flipkart-darkgray mb-4">Order Status</h3>
            <div className="flex items-center justify-between">
              {steps.map((step, idx) => (
                <div key={step.label} className="flex flex-col items-center flex-1">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg mb-1 ${step.done ? 'bg-flipkart-green text-white' : 'bg-gray-100 text-gray-400'}`}>
                    {step.icon}
                  </div>
                  <span className={`text-xs text-center font-medium ${step.done ? 'text-flipkart-green' : 'text-gray-400'}`}>
                    {step.label}
                  </span>
                  {idx < steps.length - 1 && (
                    <div className="absolute" />
                  )}
                </div>
              ))}
            </div>
            {/* Connector line */}
            <div className="flex items-center mt-2 px-5">
              {steps.slice(0, -1).map((_, idx) => (
                <div key={idx} className={`flex-1 h-0.5 ${idx === 0 ? 'bg-flipkart-green' : 'bg-gray-200'}`} />
              ))}
            </div>
          </div>

          {/* Delivery Info */}
          {deliveryDate && (
            <div className="px-8 py-4 border-b border-gray-100 bg-blue-50">
              <div className="flex items-center gap-3">
                <FiTruck className="text-flipkart-blue text-xl flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-500">Expected Delivery</p>
                  <p className="font-bold text-flipkart-darkgray text-sm">{deliveryDate}</p>
                </div>
              </div>
            </div>
          )}

          {/* Order Items */}
          {order?.items && (
            <div className="px-8 py-5 border-b border-gray-100">
              <h3 className="text-sm font-bold text-flipkart-darkgray mb-3">Items Ordered</h3>
              <div className="space-y-3">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-flipkart-gray rounded flex items-center justify-center flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-10 object-contain"
                        onError={(e) => { e.target.src = 'https://picsum.photos/seed/product/500/500'; }}
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-flipkart-darkgray line-clamp-1">{item.name}</p>
                      <p className="text-xs text-flipkart-textgray">Qty: {item.quantity}</p>
                    </div>
                    <span className="text-sm font-semibold">₹{(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Total */}
          {order && (
            <div className="px-8 py-4 border-b border-gray-100 flex justify-between items-center">
              <span className="font-bold text-flipkart-darkgray">Total Paid</span>
              <span className="font-bold text-xl text-flipkart-darkgray">₹{order.totalPrice?.toLocaleString()}</span>
            </div>
          )}

          {/* Shipping Address */}
          {order?.shippingAddress && (
            <div className="px-8 py-4 border-b border-gray-100">
              <h3 className="text-sm font-bold text-flipkart-darkgray mb-2 flex items-center gap-1.5">
                <FiHome className="text-flipkart-blue" /> Delivering to
              </h3>
              <p className="text-sm font-semibold text-flipkart-darkgray">{order.shippingAddress.name}</p>
              <p className="text-sm text-gray-600">
                {order.shippingAddress.address}, {order.shippingAddress.locality},<br />
                {order.shippingAddress.city}, {order.shippingAddress.state} – {order.shippingAddress.pincode}
              </p>
              <p className="text-sm text-gray-600 mt-0.5">📞 {order.shippingAddress.phone}</p>
            </div>
          )}

          {/* Actions */}
          <div className="px-8 py-6 flex flex-col sm:flex-row gap-3">
            <Link
              to="/orders"
              className="flex-1 bg-flipkart-blue text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-colors text-sm text-center"
            >
              📦 Track Order
            </Link>
            <Link
              to="/"
              className="flex-1 border-2 border-flipkart-blue text-flipkart-blue font-bold py-3 rounded-lg hover:bg-blue-50 transition-colors text-sm text-center"
            >
              🛍️ Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
