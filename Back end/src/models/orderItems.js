const mongoose = require('mongoose');

const orderItemsSchema = mongoose.Schema({
  orderid: {  type: mongoose.Schema.Types.ObjectId, required: true, ref: 'orders' },
  productid: {  type: mongoose.Schema.Types.ObjectId, required: true, ref: 'bakegoods' },
  priceone: {type: Number, required: true},
  quantity: {type: Number, required: true},
  price: {type: Number, required: true},
}, {
  timestamps: true
});

const orderItems = mongoose.model("orderItems", orderItemsSchema);

module.exports = orderItems;
