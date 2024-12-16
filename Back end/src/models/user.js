const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  sdt: { type: String },
  email: { type: String, required: true, unique: true },
  name: { type: String },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  shippingAddress: { type: String },
  role: { type: String, default: "Customer" },
  isAdmin: { type: Boolean, default: false },
  status: { type: String, default: "Active" },

}, {
  timestamps: true
});

const User = mongoose.model("users", userSchema);

module.exports = User;
