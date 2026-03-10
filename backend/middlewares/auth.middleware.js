import jwt from "jsonwebtoken";
import expressAsyncHandler from "express-async-handler";
import userModel from "../models/user.model.js";

const protect = expressAsyncHandler(async (req, res, next) => {

  const accessToken = req.cookies.accessToken;

  if (!accessToken) {
    return res.status(401).json({ message: "no token found" });
  }

  try {

    // verify token
    const decoded = jwt.verify(accessToken, process.env.ACCESS_SECRET);

    // find user
    const user = await userModel.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ message: "user not found" });
    }

    // attach user to request
    req.user = user;

    next();

  } catch (error) {
    return res.status(401).json({ message: "invalid or expired token" });
  }

});

export { protect };