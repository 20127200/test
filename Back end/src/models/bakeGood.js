const mongoose = require('mongoose');

const bakeGoodSchema = mongoose.Schema({
  name: { type: String,required: true, unique: true },
  description: { type: String },
  category: { type: String },
  prices: { // Array of price objects
    type: [
      {
        name: { type: String, required: true },
        price: { type: Number, required: true },
      },
    ],
    required: true,
  },
  discount: {type: Number },
  isAvailable: { type: Boolean, default: true },
  image: { type: String},
  totalTimeToCook: { type: Number }
}, {
  timestamps: true
});

const bakeGood = mongoose.model("bakeGoods", bakeGoodSchema);

module.exports = bakeGood;
