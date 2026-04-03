const crypto = require("crypto");
const express = require("express");
const Razorpay = require("razorpay");
const protect = require("../middleware/authMiddleware");
const Purchase = require("../models/Purchase");

const router = express.Router();

const PRICE_MAP = {
  Rent: 499,
  Buy: 999,
};

const getPaymentProvider = () =>
  process.env.PAYMENT_PROVIDER === "mock" ||
  !process.env.RAZORPAY_KEY_ID ||
  !process.env.RAZORPAY_KEY_SECRET
    ? "mock"
    : "razorpay";

const getRazorpayInstance = () => {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    return null;
  }

  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
};

const getAmountForType = (purchaseType) => PRICE_MAP[purchaseType];

router.get("/history", protect, async (req, res) => {
  try {
    const purchases = await Purchase.find({ user: req.user._id })
      .sort({ purchasedAt: -1 })
      .lean();

    return res.json({ purchases });
  } catch (error) {
    return res.status(500).json({ message: "Unable to load your purchase history." });
  }
});

router.post("/orders", protect, async (req, res) => {
  try {
    const { purchaseType, movie } = req.body;
    const amount = getAmountForType(purchaseType);
    const paymentProvider = getPaymentProvider();

    if (!amount) {
      return res.status(400).json({ message: "Invalid purchase type selected." });
    }

    if (!movie?.id || !movie?.title) {
      return res.status(400).json({ message: "Movie details are required for checkout." });
    }

    if (paymentProvider === "mock") {
      return res.json({
        provider: "mock",
        order: {
          id: `mock_order_${Date.now()}`,
          amount: amount * 100,
          currency: "INR",
        },
        amount,
        currency: "INR",
        message:
          "Mock Razorpay mode is active. Simulate success or failure to continue.",
      });
    }

    const razorpay = getRazorpayInstance();

    if (!razorpay) {
      return res.status(500).json({
        message:
          "Razorpay is not fully configured yet. Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to continue.",
      });
    }

    const order = await razorpay.orders.create({
      amount: amount * 100,
      currency: "INR",
      receipt: `${purchaseType.toLowerCase()}-${movie.id}-${Date.now()}`,
      notes: {
        userId: String(req.user._id),
        movieId: String(movie.id),
        purchaseType,
      },
    });

    return res.json({
      provider: "razorpay",
      order,
      keyId: process.env.RAZORPAY_KEY_ID,
      amount,
      currency: "INR",
    });
  } catch (error) {
    return res.status(500).json({ message: "Unable to create your payment order." });
  }
});

router.post("/verify", protect, async (req, res) => {
  try {
    const {
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      purchaseType,
      movie,
      provider,
    } = req.body;

    const amount = getAmountForType(purchaseType);
    const paymentProvider = provider || getPaymentProvider();

    if (!amount) {
      return res.status(400).json({ message: "Invalid purchase type selected." });
    }

    if (!movie?.id || !movie?.title) {
      return res.status(400).json({ message: "Movie details are required for verification." });
    }

    if (paymentProvider === "razorpay") {
      const generatedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "")
        .update(`${razorpayOrderId}|${razorpayPaymentId}`)
        .digest("hex");

      if (generatedSignature !== razorpaySignature) {
        return res.status(400).json({ message: "Payment verification failed." });
      }
    } else {
      if (!String(razorpayOrderId || "").startsWith("mock_order_")) {
        return res.status(400).json({ message: "Invalid mock order." });
      }

      if (!String(razorpayPaymentId || "").startsWith("mock_payment_")) {
        return res.status(400).json({ message: "Invalid mock payment." });
      }
    }

    const expiresAt =
      purchaseType === "Rent"
        ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        : null;

    const purchase = await Purchase.create({
      user: req.user._id,
      movieId: movie.id,
      title: movie.title,
      posterPath: movie.posterPath || "",
      backdropPath: movie.backdropPath || "",
      purchaseType,
      paymentProvider:
        paymentProvider === "mock" ? "mock_razorpay" : "razorpay",
      amount,
      razorpayOrderId,
      razorpayPaymentId,
      purchasedAt: new Date(),
      expiresAt,
    });

    return res.json({
      message:
        paymentProvider === "mock"
          ? `${purchaseType} completed successfully in mock Razorpay mode.`
          : `${purchaseType} completed successfully.`,
      purchase,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.json({
        message: "This payment has already been recorded.",
      });
    }

    return res.status(500).json({ message: "Unable to verify your payment." });
  }
});

module.exports = router;
