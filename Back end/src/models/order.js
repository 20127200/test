const mongoose = require('mongoose');

const OrderSchema = mongoose.Schema({
  userid: {  type: mongoose.Schema.Types.ObjectId, required: true, ref: 'users' },
  orderDate: { type: Date},
  totalAmount: { type: Number, default: 0},
  orderStatus: { type: String, default: "Cart" },
  shippingMethod: {type:String},
  paymentMethod: {type:String},
  paymentStatus: {type:String, default: "Pending"},
  specialInstructions : {type:String},
  trackingNumber: {type: Number, unique: true},
  shippingAddress: {type:String}
}, {
  timestamps: true
});

const order = mongoose.model("orders", OrderSchema);

module.exports = order;
