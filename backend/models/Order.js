const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  name: { type: String, required: true },
  image: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
});

const shippingAddressSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  pincode: { type: String, required: true },
  locality: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  addressType: { type: String, default: 'Home' },
});

const orderSchema = new mongoose.Schema(
  {
    orderId: { type: String, required: true, unique: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    guestName: { type: String },
    items: [orderItemSchema],
    shippingAddress: shippingAddressSchema,
    paymentMethod: { type: String, default: 'Cash on Delivery' },
    itemsPrice: { type: Number, required: true },
    shippingPrice: { type: Number, default: 0 },
    totalPrice: { type: Number, required: true },
    status: {
      type: String,
      enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
      default: 'Pending',
    },
    deliveryDate: { type: Date },
    placedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Generate readable Order ID
orderSchema.pre('save', function () {
  if (!this.orderId) {
    this.orderId = 'OD' + Date.now() + Math.floor(Math.random() * 1000);
  }
  // Estimate delivery: 5-7 days
  if (!this.deliveryDate) {
    const delivery = new Date();
    delivery.setDate(delivery.getDate() + 6);
    this.deliveryDate = delivery;
  }
});

module.exports = mongoose.model('Order', orderSchema);
