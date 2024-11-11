const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  orderItems: [
    {
      name: { type: String, require: true },
      amount: { type: Number, require: true },
      image: { type: String, require: true },
      price: { type: Number, require: true },
      discount: { type: Number },
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        require: true,
      },
    },
  ],
  shippingAddress: {
    fullName: { type: String, require: true },
    address: { type: String, require: true },
    city: { type: String, require: true },
    phone: { type: Number, require: true },
  },
  paymentMethod: { type: String, require: true },
  // giá của những sản phẩm
  itemsPrice: { type: String, require: true },
  shippingPrice: { type: String, require: true },
  // itemsPrice + shippingPrice + taxPrice
  totalPrice: { type: String, require: true },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    require: true,
  },
  isPaid: { type: Boolean, default: false },
  paidAt: { type: Date },
  isDelivered: { type: Boolean, default: false },
  deliveredAt: { type: Date },
});

const Order = mongoose.model("Oder", orderSchema);
module.exports = Order;
