import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { createOrder } from '../api/api';
import { toast } from 'react-toastify';
import { FiMapPin, FiEdit3 } from 'react-icons/fi';

const STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Delhi', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
  'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan',
  'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh',
  'Uttarakhand', 'West Bengal',
];

const defaultAddress = {
  name: '',
  phone: '',
  pincode: '',
  locality: '',
  address: '',
  city: '',
  state: '',
  addressType: 'Home',
};

const InputField = ({ label, name, type = 'text', placeholder, half, value, onChange, error }) => (
  <div className={half ? 'col-span-1' : 'col-span-2'}>
    <label className="block text-xs font-semibold text-gray-600 mb-1">{label} *</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`w-full border rounded-lg px-3 py-2.5 text-sm outline-none transition-colors ${
        error ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-flipkart-blue'
      }`}
    />
    {error && <p className="text-red-500 text-xs mt-0.5">{error}</p>}
  </div>
);

const Checkout = () => {
  const { items, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState(defaultAddress);
  const [errors, setErrors] = useState({});
  const [placing, setPlacing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');
  const [upiId, setUpiId] = useState('');
  const [upiError, setUpiError] = useState('');
  const [cardDetails, setCardDetails] = useState({ number: '', expiry: '', cvv: '' });
  const [cardErrors, setCardErrors] = useState({});

  const shippingCost = cartTotal > 500 ? 0 : 40;
  const totalWithShipping = cartTotal + shippingCost;
  const totalDiscount = items.reduce(
    (acc, item) => acc + ((item.originalPrice || item.price) - item.price) * item.quantity, 0
  );

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!/^\d{10}$/.test(form.phone)) e.phone = 'Enter valid 10-digit phone number';
    if (!/^\d{6}$/.test(form.pincode)) e.pincode = 'Enter valid 6-digit pincode';
    if (!form.locality.trim()) e.locality = 'Locality is required';
    if (!form.address.trim()) e.address = 'Address is required';
    if (!form.city.trim()) e.city = 'City is required';
    if (!form.state) e.state = 'State is required';

    // Payment method validation
    if (paymentMethod === 'UPI / Net Banking') {
      if (!upiId.trim()) {
        e.upi = 'UPI ID is required';
        setUpiError('UPI ID is required');
      } else if (!/^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/.test(upiId)) {
        e.upi = 'Invalid UPI ID format (e.g. user@okhdfcbank)';
        setUpiError('Invalid UPI ID format (e.g. user@okhdfcbank)');
      } else {
        setUpiError('');
      }
    } else if (paymentMethod === 'Debit / Credit Card') {
      const cardErrs = {};
      const cleanCardNumber = cardDetails.number.replace(/\s+/g, '');
      if (!/^\d{16}$/.test(cleanCardNumber)) cardErrs.number = 'Card number must be 16 digits';
      if (!/^(0[1-9]|1[0-2])\/?([0-9]{2})$/.test(cardDetails.expiry)) cardErrs.expiry = 'Use MM/YY format';
      if (!/^\d{3}$/.test(cardDetails.cvv)) cardErrs.cvv = 'CVV must be 3 digits';
      setCardErrors(cardErrs);
      if (Object.keys(cardErrs).length > 0) {
        e.card = 'Card details are invalid';
      }
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const pincodeLookup = (pin) => {
    const prefix = pin.substring(0, 2);
    const stateMap = {
      '11': { state: 'Delhi', city: 'New Delhi' },
      '12': { state: 'Haryana', city: 'Gurugram' },
      '13': { state: 'Haryana', city: 'Faridabad' },
      '14': { state: 'Punjab', city: 'Amritsar' },
      '15': { state: 'Punjab', city: 'Ludhiana' },
      '16': { state: 'Punjab', city: 'Chandigarh' },
      '17': { state: 'Himachal Pradesh', city: 'Shimla' },
      '20': { state: 'Uttar Pradesh', city: 'Noida' },
      '22': { state: 'Uttar Pradesh', city: 'Lucknow' },
      '24': { state: 'Uttarakhand', city: 'Dehradun' },
      '25': { state: 'Uttar Pradesh', city: 'Ghaziabad' },
      '27': { state: 'Uttar Pradesh', city: 'Kanpur' },
      '28': { state: 'Uttar Pradesh', city: 'Agra' },
      '30': { state: 'Rajasthan', city: 'Jaipur' },
      '34': { state: 'Rajasthan', city: 'Jodhpur' },
      '36': { state: 'Gujarat', city: 'Rajkot' },
      '38': { state: 'Gujarat', city: 'Ahmedabad' },
      '39': { state: 'Gujarat', city: 'Surat' },
      '40': { state: 'Maharashtra', city: 'Mumbai' },
      '41': { state: 'Maharashtra', city: 'Pune' },
      '44': { state: 'Maharashtra', city: 'Nagpur' },
      '45': { state: 'Madhya Pradesh', city: 'Indore' },
      '46': { state: 'Madhya Pradesh', city: 'Bhopal' },
      '49': { state: 'Chhattisgarh', city: 'Raipur' },
      '50': { state: 'Telangana', city: 'Hyderabad' },
      '53': { state: 'Andhra Pradesh', city: 'Visakhapatnam' },
      '56': { state: 'Karnataka', city: 'Bengaluru' },
      '57': { state: 'Karnataka', city: 'Mysuru' },
      '60': { state: 'Tamil Nadu', city: 'Chennai' },
      '62': { state: 'Tamil Nadu', city: 'Madurai' },
      '64': { state: 'Tamil Nadu', city: 'Coimbatore' },
      '68': { state: 'Kerala', city: 'Kochi' },
      '69': { state: 'Kerala', city: 'Thiruvananthapuram' },
      '70': { state: 'West Bengal', city: 'Kolkata' },
      '73': { state: 'West Bengal', city: 'Darjeeling' },
      '75': { state: 'Odisha', city: 'Bhubaneswar' },
      '78': { state: 'Assam', city: 'Guwahati' },
      '80': { state: 'Bihar', city: 'Patna' },
      '83': { state: 'Jharkhand', city: 'Ranchi' },
    };
    return stateMap[prefix] || null;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => {
      const updated = { ...prev, [name]: value };
      
      // Auto-fill City & State based on Pincode (first 2 digits)
      if (name === 'pincode' && /^\d{6}$/.test(value)) {
        const lookup = pincodeLookup(value);
        if (lookup) {
          updated.city = lookup.city;
          updated.state = lookup.state;
          // Clear validation errors for city/state
          setErrors((errs) => ({ ...errs, city: '', state: '' }));
        }
      }
      
      return updated;
    });
    
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handlePlaceOrder = async () => {
    if (!validate()) {
      toast.error('Please fill all required fields correctly');
      return;
    }
    setPlacing(true);
    try {
      const orderData = {
        items: items.map((item) => ({
          product: item._id,
          name: item.name,
          image: item.images?.[0] || '',
          price: item.price,
          quantity: item.quantity,
        })),
        shippingAddress: form,
        paymentMethod,
        guestName: form.name,
        itemsPrice: cartTotal,
        shippingPrice: shippingCost,
        totalPrice: totalWithShipping,
      };
      const { data } = await createOrder(orderData);
      clearCart();
      navigate(`/order-success/${data.orderId}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order. Try again.');
    } finally {
      setPlacing(false);
    }
  };



  return (
    <div className="min-h-screen bg-flipkart-gray">
      <div className="max-w-6xl mx-auto px-4 py-4">
        {/* Progress Steps */}
        <div className="bg-white rounded-xl shadow-sm px-6 py-4 mb-4">
          <div className="flex items-center gap-2">
            {['Cart', 'Address', 'Summary', 'Payment'].map((step, idx) => (
              <div key={step} className="flex items-center gap-2">
                <div className={`flex items-center gap-1.5 ${idx <= 1 ? 'text-flipkart-blue font-semibold' : 'text-gray-400'}`}>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${idx <= 1 ? 'bg-flipkart-blue text-white' : 'bg-gray-200 text-gray-500'}`}>
                    {idx + 1}
                  </div>
                  <span className="text-sm hidden sm:block">{step}</span>
                </div>
                {idx < 3 && <div className="flex-1 h-0.5 bg-gray-200 min-w-[20px]" />}
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          {/* Left: Address Form */}
          <div className="flex-1">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-base font-bold text-flipkart-darkgray mb-5 flex items-center gap-2">
                <FiMapPin className="text-flipkart-blue" /> Delivery Address
              </h2>

              <div className="grid grid-cols-2 gap-4">
                <InputField label="Full Name" name="name" value={form.name} onChange={handleChange} error={errors.name} placeholder="Enter your full name" half />
                <InputField label="Phone Number" name="phone" type="tel" value={form.phone} onChange={handleChange} error={errors.phone} placeholder="10-digit phone number" half />
                <InputField label="Pincode" name="pincode" value={form.pincode} onChange={handleChange} error={errors.pincode} placeholder="6-digit Pincode (e.g. 560001)" half />
                <InputField label="Locality" name="locality" value={form.locality} onChange={handleChange} error={errors.locality} placeholder="Locality / Area / Sector (e.g. Indiranagar)" half />
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Address (Area and Street) *</label>
                  <textarea
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    placeholder="Flat, House No., Building, Apartment, Street"
                    rows={2}
                    className={`w-full border rounded-lg px-3 py-2.5 text-sm outline-none resize-none transition-colors ${
                      errors.address ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-flipkart-blue'
                    }`}
                  />
                  {errors.address && <p className="text-red-500 text-xs mt-0.5">{errors.address}</p>}
                </div>
                <InputField label="City / District / Town" name="city" value={form.city} onChange={handleChange} error={errors.city} placeholder="City / District / Town (e.g. Bengaluru)" half />
                <div className="col-span-1">
                  <label className="block text-xs font-semibold text-gray-600 mb-1">State *</label>
                  <select
                    name="state"
                    value={form.state}
                    onChange={handleChange}
                    className={`w-full border rounded-lg px-3 py-2.5 text-sm outline-none transition-colors ${
                      errors.state ? 'border-red-400' : 'border-gray-200 focus:border-flipkart-blue'
                    }`}
                  >
                    <option value="">Select State</option>
                    {STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                  {errors.state && <p className="text-red-500 text-xs mt-0.5">{errors.state}</p>}
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Address Type</label>
                  <div className="flex gap-3">
                    {['Home', 'Work'].map((type) => (
                      <label key={type} className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="radio"
                          name="addressType"
                          value={type}
                          checked={form.addressType === type}
                          onChange={handleChange}
                          className="accent-flipkart-blue"
                        />
                        <span className="text-sm text-gray-700">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-xl shadow-sm p-6 mt-4">
              <h2 className="text-base font-bold text-flipkart-darkgray mb-4 text-sm uppercase tracking-wider">Payment Method</h2>
              <div className="space-y-3">
                {/* Cash on Delivery */}
                <div className={`border rounded-xl p-4 transition-colors ${paymentMethod === 'Cash on Delivery' ? 'border-flipkart-blue bg-blue-50/10' : 'border-gray-100 hover:bg-gray-50/50'}`}>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="payment"
                      value="Cash on Delivery"
                      checked={paymentMethod === 'Cash on Delivery'}
                      onChange={() => setPaymentMethod('Cash on Delivery')}
                      className="accent-flipkart-blue w-4 h-4"
                    />
                    <div>
                      <span className="text-sm text-flipkart-darkgray font-bold">Cash on Delivery (COD)</span>
                      <p className="text-xs text-gray-500 mt-0.5">Pay with cash or scan QR code on delivery</p>
                    </div>
                    <span className="ml-auto text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded font-bold">Recommended</span>
                  </label>
                  {paymentMethod === 'Cash on Delivery' && (
                    <div className="mt-3 pl-7 border-t border-dashed border-gray-200 pt-3">
                      <div className="bg-emerald-50 text-emerald-800 text-xs p-3 rounded-lg border border-emerald-100 font-medium">
                        ✓ Safe and secure. Pay at your doorstep with Cash/UPI.
                      </div>
                    </div>
                  )}
                </div>

                {/* UPI */}
                <div className={`border rounded-xl p-4 transition-colors ${paymentMethod === 'UPI / Net Banking' ? 'border-flipkart-blue bg-blue-50/10' : 'border-gray-100 hover:bg-gray-50/50'}`}>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="payment"
                      value="UPI / Net Banking"
                      checked={paymentMethod === 'UPI / Net Banking'}
                      onChange={() => setPaymentMethod('UPI / Net Banking')}
                      className="accent-flipkart-blue w-4 h-4"
                    />
                    <div>
                      <span className="text-sm text-flipkart-darkgray font-bold">UPI (PhonePe / Google Pay / BHIM)</span>
                      <p className="text-xs text-gray-500 mt-0.5">Instant pay via any UPI app</p>
                    </div>
                  </label>
                  {paymentMethod === 'UPI / Net Banking' && (
                    <div className="mt-3 pl-7 border-t border-dashed border-gray-200 pt-3 space-y-2">
                      <label className="block text-xs font-semibold text-gray-600">Enter UPI ID *</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="e.g. mobile@upi, username@okhdfcbank"
                          value={upiId}
                          onChange={(e) => { setUpiId(e.target.value); setUpiError(''); }}
                          className={`flex-1 border rounded-lg px-3 py-2 text-sm outline-none transition-colors ${upiError ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-flipkart-blue'}`}
                        />
                        <button type="button" className="bg-flipkart-blue text-white text-xs px-4 py-2 rounded-lg font-semibold hover:bg-blue-600 transition-colors">
                          Verify
                        </button>
                      </div>
                      {upiError && <p className="text-red-500 text-xs">{upiError}</p>}
                    </div>
                  )}
                </div>

                {/* Card */}
                <div className={`border rounded-xl p-4 transition-colors ${paymentMethod === 'Debit / Credit Card' ? 'border-flipkart-blue bg-blue-50/10' : 'border-gray-100 hover:bg-gray-50/50'}`}>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="payment"
                      value="Debit / Credit Card"
                      checked={paymentMethod === 'Debit / Credit Card'}
                      onChange={() => setPaymentMethod('Debit / Credit Card')}
                      className="accent-flipkart-blue w-4 h-4"
                    />
                    <div>
                      <span className="text-sm text-flipkart-darkgray font-bold">Credit / Debit Card</span>
                      <p className="text-xs text-gray-500 mt-0.5">All major cards supported</p>
                    </div>
                  </label>
                  {paymentMethod === 'Debit / Credit Card' && (
                    <div className="mt-3 pl-7 border-t border-dashed border-gray-200 pt-3 space-y-3">
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">Card Number *</label>
                        <input
                          type="text"
                          maxLength="19"
                          placeholder="4321 8765 2345 9876"
                          value={cardDetails.number.replace(/\s?/g, '').replace(/(\d{4})/g, '$1 ').trim()}
                          onChange={(e) => {
                            setCardDetails({ ...cardDetails, number: e.target.value.replace(/\s+/g, '') });
                            setCardErrors({ ...cardErrors, number: '' });
                          }}
                          className={`w-full border rounded-lg px-3 py-2 text-sm outline-none transition-colors ${cardErrors.number ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-flipkart-blue'}`}
                        />
                        {cardErrors.number && <p className="text-red-500 text-xs mt-0.5">{cardErrors.number}</p>}
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-semibold text-gray-600 mb-1">Expiry Date *</label>
                          <input
                            type="text"
                            maxLength="5"
                            placeholder="MM/YY"
                            value={cardDetails.expiry}
                            onChange={(e) => {
                              let val = e.target.value;
                              if (val.length === 2 && !val.includes('/')) val += '/';
                              setCardDetails({ ...cardDetails, expiry: val });
                              setCardErrors({ ...cardErrors, expiry: '' });
                            }}
                            className={`w-full border rounded-lg px-3 py-2 text-sm outline-none transition-colors ${cardErrors.expiry ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-flipkart-blue'}`}
                          />
                          {cardErrors.expiry && <p className="text-red-500 text-xs mt-0.5">{cardErrors.expiry}</p>}
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-600 mb-1">CVV *</label>
                          <input
                            type="password"
                            maxLength="3"
                            placeholder="123"
                            value={cardDetails.cvv}
                            onChange={(e) => {
                              setCardDetails({ ...cardDetails, cvv: e.target.value });
                              setCardErrors({ ...cardErrors, cvv: '' });
                            }}
                            className={`w-full border rounded-lg px-3 py-2 text-sm outline-none transition-colors ${cardErrors.cvv ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-flipkart-blue'}`}
                          />
                          {cardErrors.cvv && <p className="text-red-500 text-xs mt-0.5">{cardErrors.cvv}</p>}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right: Order Summary */}
          <div className="md:w-80 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden sticky top-24">
              {/* Items List */}
              <div className="px-5 py-4 border-b border-gray-100">
                <h3 className="text-xs font-bold text-flipkart-textgray uppercase tracking-wider mb-3">
                  Order Items ({items.length})
                </h3>
                <div className="space-y-3 max-h-52 overflow-y-auto pr-1">
                  {items.map((item) => (
                    <div key={item._id} className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-flipkart-gray rounded flex items-center justify-center flex-shrink-0">
                        <img
                          src={item.images?.[0]}
                          alt={item.name}
                          className="h-10 object-contain"
                          onError={(e) => { e.target.src = 'https://picsum.photos/seed/product/500/500'; }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-flipkart-darkgray line-clamp-1">{item.name}</p>
                        <p className="text-xs text-flipkart-textgray">Qty: {item.quantity}</p>
                      </div>
                      <span className="text-xs font-semibold text-flipkart-darkgray">
                        ₹{(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="px-5 py-4 space-y-2.5">
                <div className="flex justify-between text-sm text-flipkart-darkgray">
                  <span>Subtotal</span>
                  <span>₹{cartTotal.toLocaleString()}</span>
                </div>
                {totalDiscount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-flipkart-darkgray">Discount</span>
                    <span className="text-flipkart-green font-semibold">- ₹{totalDiscount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm text-flipkart-darkgray">
                  <span>Delivery</span>
                  <span className={shippingCost === 0 ? 'text-flipkart-green font-medium' : ''}>
                    {shippingCost === 0 ? 'Free' : `₹${shippingCost}`}
                  </span>
                </div>
                <div className="border-t border-dashed border-gray-200 pt-2.5">
                  <div className="flex justify-between font-bold text-flipkart-darkgray">
                    <span>Total</span>
                    <span>₹{totalWithShipping.toLocaleString()}</span>
                  </div>
                </div>
                {totalDiscount > 0 && (
                  <p className="text-flipkart-green text-xs font-semibold text-center">
                    🎉 You save ₹{totalDiscount.toLocaleString()}!
                  </p>
                )}
              </div>

              <div className="px-5 pb-5">
                <button
                  onClick={handlePlaceOrder}
                  disabled={placing}
                  className="w-full bg-flipkart-orange text-white font-bold py-3.5 rounded-lg hover:bg-orange-600 transition-colors shadow-md text-sm disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {placing ? '⏳ Placing Order...' : '✓ Place Order'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
