import asyncHandler from "express-async-handler";
import Order from "../models/orderModel.js";
import Razorpay from "razorpay";
import Product from "../models/productModel.js";
import shortid from "shortid";
import crypto from "crypto";
const addDecimals = (num) => {
  return (Math.round(num * 100) / 100).toFixed(2);
};

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = asyncHandler(async (req, res) => {
  const { orderItems, shippingAddress, paymentMethod } = req.body;

  if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error("No order items");
    return;
  } else {
    let itemsPrice = await orderItems.reduce(async (previousPromise, item) => {
      let total = await previousPromise;
      const product = await Product.findById(item.product);
      return total + product.price * item.qty;
    }, Promise.resolve(0));

    let taxPrice = addDecimals(Number((0.15 * itemsPrice).toFixed(2)));
    itemsPrice -= taxPrice;
    // Figure delivery price later
    let shippingPrice = addDecimals(itemsPrice > 3000 ? 0 : 0);
    let totalPrice = Number(
      Number(taxPrice) + Number(itemsPrice) + Number(shippingPrice)
    ).toFixed(2);

    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_SECRET,
    });

    let options = {
      amount: totalPrice * 100,
      currency: "INR",
      receipt: shortid.generate(),
    };

    let razorpayOrder;
    try {
      razorpayOrder = await instance.orders.create(options);
    } catch (err) {
      console.log(err);
    }
    if (razorpayOrder.error) {
      res.status(500);
    }

    const order = new Order({
      orderItems,
      razorpay: razorpayOrder,
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    });
    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  }
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );

  if (order) {
    res.json(order);
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
const updateOrderToPaid = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  try {
    const {
      orderCreationId,
      razorpayPaymentId,
      razorpayOrderId,
      razorpaySignature,
    } = req.body;

    const shasum = crypto.createHmac("sha256", process.env.RAZORPAY_SECRET);

    shasum.update(`${orderCreationId}|${razorpayPaymentId}`);

    const digest = shasum.digest("hex");

    if (digest !== razorpaySignature)
      return res.status(400).json({ msg: "Transaction not legit!" });

    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      msg: "success",
      orderId: razorpayOrderId,
      paymentId: razorpayPaymentId,
    };

    const updatedOrder = await order.save();

    res.json(updatedOrder);
  } catch (err) {
    console.log(err);
    return res.status(400).json({ ...err });
  }
});

// @desc    Update order to delivered
// @route   GET /api/orders/:id/deliver
// @access  Private/Admin
const updateOrderToDelivered = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isDelivered = true;
    order.deliveredAt = Date.now();

    const updatedOrder = await order.save();

    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id });
  res.json(orders);
});

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({}).populate("user", "id name");
  res.json(orders);
});

export {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getMyOrders,
  getOrders,
};
