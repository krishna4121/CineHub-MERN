const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const protect = require("../middleware/authMiddleware");
const createToken = require("../utils/createToken");

const router = express.Router();

const normalizeEmail = (email = "") => email.trim().toLowerCase();

const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);

const cookieOptions = {
  httpOnly: true,
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

const serializeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
});

router.post("/signup", async (req, res) => {
  try {
    const { name = "", email = "", password = "", confirmPassword = "" } = req.body;
    const trimmedName = name.trim();
    const normalizedEmail = normalizeEmail(email);

    if (!trimmedName) {
      return res.status(400).json({ message: "Please enter your full name." });
    }

    if (!isValidEmail(normalizedEmail)) {
      return res.status(400).json({ message: "Please enter a valid email address." });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters long.",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match." });
    }

    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      return res.status(409).json({
        message: "An account with this email already exists.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name: trimmedName,
      email: normalizedEmail,
      password: hashedPassword,
    });

    const token = createToken(user._id);
    res.cookie("token", token, cookieOptions);

    return res.status(201).json({
      message: "Account created successfully.",
      user: serializeUser(user),
    });
  } catch (error) {
    return res.status(500).json({ message: "Unable to create your account right now." });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email = "", password = "" } = req.body;
    const normalizedEmail = normalizeEmail(email);

    if (!isValidEmail(normalizedEmail)) {
      return res.status(400).json({ message: "Please enter a valid email address." });
    }

    if (!password) {
      return res.status(400).json({ message: "Please enter your password." });
    }

    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const passwordMatches = await bcrypt.compare(password, user.password);

    if (!passwordMatches) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const token = createToken(user._id);
    res.cookie("token", token, cookieOptions);

    return res.json({
      message: "Signed in successfully.",
      user: serializeUser(user),
    });
  } catch (error) {
    return res.status(500).json({ message: "Unable to sign you in right now." });
  }
});

router.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  return res.json({ message: "Logged out successfully." });
});

router.get("/me", protect, (req, res) => {
  return res.json({ user: serializeUser(req.user) });
});

module.exports = router;

