import mongoose from "mongoose";
import { applyDiscount } from "../middlewares/discountHandler.js";

const Schema = mongoose.Schema;

const orderSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  items: [{
    book: {
      type: Schema.Types.ObjectId,
      ref: "Book",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    price: {
      type: Number,
      required: true,
    },
  }],
  totalPrice: {
    type: Number,
    required: true,
  },
  discountCode: {
    type: String,
    default: null,
  },
  discountAmount: {
    type: Number,
    default: 0,
  },
  finalPrice: {
    type: Number,
    required: true,
  },
  shippingAddress: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
    default: "pending",
  },
  paymentMethod: {
    type: String,
    enum: ["cash", "credit_card", "paypal"],
    required: true,
    default: "cash"
  },
  freeShip: {
    type: Boolean,
    default: false,
  },
  shipFee: {
    type: Number,
    default: 0,
    min: 0
  },
  superFastShip: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

orderSchema.pre("save", async function (next) {
  this.updatedAt = Date.now();
  await applyDiscount(this);
  if (this.freeShip) {
    this.shipFee = 0;
  }
  if (this.superFastShip) {
    this.shipFee = this.shipFee + 30000;
  }
  this.finalPrice = this.totalPrice - this.discountAmount + this.shipFee;
  if (this.finalPrice < 0) this.finalPrice = 0;
  next();
});

const Order = mongoose.model("Order", orderSchema);
export default Order;