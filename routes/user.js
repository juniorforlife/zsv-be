import express from "express";
import validator from "express-validator";
import bcrypt from "bcryptjs";
import config from "config";

import { User } from "../models/index.js";
import format from "../utils/format.js";
import authMiddleware from "../middlewares/auth.js";

const { check, validationResult } = validator;

const router = express.Router();

/**
 * @desc Get current logged in user
 */
router.get("/api/users/me", authMiddleware, async (req, res) => {
  res.status(200).json(req.user);
});

/**
 * @desc Create a new user
 */
router.post(
  "/api/users",
  [
    check("email", "Email is not valid").isEmail(),
    check("password", "Password must be at least 8 characters").isLength({
      min: 8,
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, firstName, lastName, address, phone } = req.body;

    try {
      const user = await User.findOne({ email });
      if (user) {
        return res
          .status(400)
          .json(format.httpError(400, "User already exists"));
      }
      const newUser = new User({
        email,
        password,
        firstName,
        lastName,
        address,
        phone,
      });
      newUser.password = await bcrypt.hash(password, 10);
      await newUser.save();

      const token = await newUser.generateAuthToken();

      res.status(201).json({ user: newUser, token });
    } catch (error) {
      res.status(500).send();
    }
  }
);

/**
 * @desc Login user
 */
router.post(
  "/api/users/login",
  [
    check("email", "Email is not valid").isEmail(),
    check("password", "Password must be at least 8 characters").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email });
      if (!user) {
        res.status(400).json(format.httpError(400, "Invalid credentials"));
      }

      const isMatch = bcrypt.compare(password, user.password);
      if (!isMatch) {
        res.status(400).json(format.httpError(400, "Invalid credentials"));
      }

      const token = await user.generateAuthToken(config.get("jwtSecret"));

      res.status(200).json({ user, token });
    } catch (error) {
      console.log(error);
      res.status(404);
    }
  }
);

/**
 * @desc Logout
 */
router.post("/api/users/logout", authMiddleware, async (req) => {
  try {
  } catch (err) {}
});

/**
 * @desc Edit user
 */
router.patch("/api/users/:id", authMiddleware, async (req) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // return updated user,
      runValidators: true,
    });
    if (!user) {
      return res.status(404).error(format(404, "User not found"));
    }
    res.status(200).json(user);
  } catch (err) {}
});

// router.get("/api/users", auth, async (req, res) => {
//   try {
//     const users = await User.find({});
//     res.status(200).json(users);
//   } catch (err) {
//     res.status(500).send()
//   }
// });

export default router;
