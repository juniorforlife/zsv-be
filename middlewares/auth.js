import jwt from "jsonwebtoken";
import config from "config";

import format from "../utils/format.js";
import User from "../models/User.js";

export default async function (req, res, next) {
  const bearer = req.header("Authorization");
  if (!bearer) {
    return res.status(401).json(format.httpError(401, "Unauthorized"));
  }

  try {
    const token = bearer.replace("Bearer ", "");
    const decodedToken = jwt.verify(token, config.get("jwtSecret"));

    const user = await User.findById(decodedToken.userId);
    req.user = user;
    req.token = token;

    next();
  } catch (error) {
    res.status(401).json(format.httpError(401, "Unauthorized"));
  }
}
