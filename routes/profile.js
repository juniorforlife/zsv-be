import express from "express";
import mongoose from "mongoose";

import authMiddleware from "../middlewares/auth.js";
import { Profile } from "../models/index.js";
import format from "../utils/format.js";

const router = express.Router();
/**
 * @route GET  api/profiles/
 * @desc  Get profiles by params
 * @access Public
 */

router.get("/api/profiles", authMiddleware, async (req, res) => {
  try {
    const profiles = await Profile.find({});
    res.status(200).json(profiles);
  } catch (error) {}
});

/**
 * @route GET  api/profiles/:id
 * @desc  Get profile by id
 * @access Public
 */

router.get("/api/profiles/:id", async (req, res) => {
  const {
    params: { id },
  } = req;
  if (id) {
    try {
      if (mongoose.Types.ObjectId.isValid(id)) {
        const profile = await Profile.findById(id);
        if (!profile) {
          return res.error(404, "Profile not found");
        }
        res.status(200).json(profile);
      } else {
        res.status(404).json(format.httpError(404, "Profile not found"));
      }
    } catch (err) {
      res.status(500).send();
    }
  }
});

export default router;
